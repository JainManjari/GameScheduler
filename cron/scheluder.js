const cron = require("node-cron");
const moment = require("moment");

const Player = require("../models/player");
const Game = require("../models/game");
const PlayerGameMapping = require("../models/playerGameMapping");

function scheduler() {
  cron.schedule("0 */1 * * * *", async () => {
    try {
      const today = moment();
      const yesterday = moment(today).subtract(2, "hours");

      console.log("started ", moment.now());

      let games = await Game.find({
        createdAt: {
          $gte: yesterday.toDate(),
          $lte: today.toDate(),
        },
      });

      if (games.length == 0) {
        console.log(`No new games created btw ${yesterday} and ${today}`);
        console.log("completed ", moment.now());
        return;
      }

      let playerIdMapping = {};
      let playerGameIdMapping = {};

      for (let game of games) {
        const playerScores = game.playerScores;
        for (let playerScore of playerScores) {
          let playerId = playerScore.playerId.toString();
          let player;

          if (!(playerId in playerIdMapping)) {
            player = await Player.findById(playerId);
            playerIdMapping[playerId] = player;
          }

          player = playerIdMapping[playerId];
          if (!player) {
            continue;
          }

          let score = playerScore.score;
          let playerGameMapping;

          if (!(playerId in playerGameIdMapping)) {
            playerGameMapping = await PlayerGameMapping.findOne({
              player: playerId,
            });
            if (!playerGameMapping) {
              playerGameMapping = await PlayerGameMapping.create({
                player: playerId,
                totalGames: 0,
                totalScore: 0,
                gameScores: [],
                playerName: player.name,
              });
            }
            playerGameIdMapping[playerId] = playerGameMapping;
          }
          playerGameMapping = playerGameIdMapping[playerId];

          if (playerGameMapping.gameScores.length === 0) {
            playerGameMapping.gameScores.push({
              gameId: game._id.toString(),
              score: score,
            });
            playerGameMapping.totalGames += 1;
            playerGameMapping.totalScore += score;
          } else {
            let found = false;
            for (let gameScore of playerGameMapping.gameScores) {
              if (gameScore.gameId == game._id.toString()) {
                found = true;
                break;
              }
            }

            if (!found) {
              playerGameMapping.gameScores.push({
                gameId: game._id.toString(),
                score: score,
              });
              playerGameMapping.totalGames += 1;
              playerGameMapping.totalScore += score;
            }
          }
          playerGameIdMapping[playerId] = playerGameMapping;
        }
      }

      const playerGameMappings = [];
      for (let playerId in playerGameIdMapping) {
        playerGameMappings.push(playerGameIdMapping[playerId]);
      }

      const bulkOps = playerGameMappings.map((obj) => {
        return {
          updateOne: {
            filter: {
              _id: obj._id,
            },
            update: {
              gameScores: obj.gameScores,
              totalGames: obj.totalGames,
              totalScore: obj.totalScore,
            },
          },
        };
      });

      await PlayerGameMapping.bulkWrite(bulkOps);
      console.log("completed ", moment.now());
    } catch (err) {
      console.log(
        "error in recalibrating player game mapping scheduler ",
        err
      );
    }
  });
}

module.exports = scheduler();

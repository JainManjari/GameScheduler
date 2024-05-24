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

      const startedTime = moment();

      console.log(`------Scheduler started at ${today}-------`);

      console.log(`Finding new games btw ${yesterday} & ${today}`);

      let games = await Game.find({
        createdAt: {
          $gte: yesterday.toDate(),
          $lte: today.toDate(),
        },
      });

      if (games.length == 0) {
        console.log(`No new games created btw ${yesterday} and ${today}`);
        const endedTime = moment();
        const ms = moment(endedTime, "DD/MM/YYYY HH:mm:ss").diff(
          moment(startedTime, "DD/MM/YYYY HH:mm:ss")
        );
        const duration = moment.duration(ms);
        console.log(
          `-------------Scheduler completed in ${duration.asSeconds()} seconds--------------`,
          "\n\n\n\n\n\n"
        );
        return;
      }

      console.log(
        `Found ${games.length} new games created btw ${yesterday} and ${today}`
      );

      let playerIdMapping = {};
      let playerGameIdMapping = {};

      let index = 1;

      for (let game of games) {
        const playerScores = game.playerScores;
        console.log(
            `Started game ${index} having playerScores of length ${playerScores.length}`
          );
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
                console.log(`This game ${index} already computed for player ${player.name}.`)
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
        console.log(
          `Completed game ${index} having playerScores of length ${playerScores.length}`
        );
        index += 1;
      }

      const playerGameMappings = [];
      for (let playerId in playerGameIdMapping) {
        playerGameMappings.push(playerGameIdMapping[playerId]);
      }

      console.log(`Total operations to perform for players ${Object.keys(playerGameIdMapping).length}`);

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
      console.log(
        `Written in bulk to PlayerGameMapping of size ${bulkOps.length}`
      );
      const endedTime = moment();
      const ms = moment(endedTime, "DD/MM/YYYY HH:mm:ss").diff(
        moment(startedTime, "DD/MM/YYYY HH:mm:ss")
      );
      const duration = moment.duration(ms);
      console.log(
        `-------------Scheduler completed in ${duration.asSeconds()} seconds--------------`,
        "\n\n\n\n\n\n"
      );
    } catch (err) {
      console.log("error in recalibrating player game mapping scheduler ", err);
    }
  });
}

module.exports = scheduler;

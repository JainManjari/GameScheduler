const Player = require("../models/player");
const Game = require("../models/game");
const PlayerGameMapping = require("../models/playerGameMapping");

const moment = require("moment");

module.exports.recalibratePlayerGameMapping = async function (req, res) {
  try {
    const today = moment().endOf("day");
    const yesterday = moment(today).subtract(1, "days").startOf("day");

    let games = await Game.find({
      createdAt: {
        $gte: yesterday.toDate(),
        $lte: today.toDate(),
      },
    });

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

        if (playerGameMapping.gameScores.length===0) {
          playerGameMapping.gameScores.push({
            gameId: game._id.toString(),
            score: score,
          });
          playerGameMapping.totalGames += 1;
          playerGameMapping.totalScore += score;
        } else {
          let found = false;
          for (let gameScore of playerGameMapping.gameScores) {
            if (gameScore.gameId==game._id.toString()) {
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

    let responseData = [];

    for (let playerGameMapping of playerGameMappings) {
      let playerGameMapObj = {};
      playerGameMapObj.playerName = playerGameMapping.playerName;
      playerGameMapObj.totalScore = playerGameMapping.totalScore;
      playerGameMapObj.totalGames = playerGameMapping.totalGames;
      playerGameMapObj.gameScores = playerGameMapping.gameScores.map(
        (gameScore) => ({
          score: gameScore.score,
        })
      );
      responseData.push(playerGameMapObj);
    }

    return res.status(200).json({
      data: {
        count: games.length,
        responseData,
      },
    });
  } catch (err) {
    console.log("error in recalibrating player game mapping controller ", err);
    return res.status(500).json({
      data: {
        error: err,
      },
    });
  }
};

module.exports.getTopPlayers = async function (req, res) {
  try {
    let playerGameMapping = await PlayerGameMapping.find({})
      .sort({ totalScore: -1 })
      .limit(5);

    playerGameMapping = playerGameMapping.map((playerGameMap) => ({
      playerName: playerGameMap.playerName,
      totalGames: playerGameMap.totalGames,
      totalScore: playerGameMap.totalScore,
    }));

    return res.status(200).json({
      data: {
        playerGameMapping,
      },
    });
  } catch (err) {
    console.log("error in recalibrating player game mapping controller ", err);
    return res.status(500).json({
      data: {
        error: err,
      },
    });
  }
};

const Player = require("../models/player");
const Game = require("../models/game");

module.exports.createGame = async function (req, res) {
  try {
    let noOfPlayers = req.body.count;

    if (isNaN(noOfPlayers)) {
      noOfPlayers = Math.floor(Math.random() * 10) + 1;
    }

    let selectedPlayers = await Player.aggregate().sample(noOfPlayers);

    const gameData = {
      count: noOfPlayers,
      playerScores: [],
    };

    for (let player of selectedPlayers) {
      // generating random score for players btw 1 to 100
      let score = Math.floor(Math.random() * 100) + 1;
      let playerScore = {
        name: player.name,
        playerId: player._id,
        score: score,
      };
      gameData.playerScores.push(playerScore);
    }

    let game = await Game.create({
      players: gameData.count,
      playerScores: gameData.playerScores,
    });

    return res.json(200, {
      gameData,
    });
  } catch (err) {
    console.log("error in creating game controller ", err);
    return res.status(500).json({
      data: {
        error: err,
      },
    });
  }
};

module.exports.getAllGames = async function (req, res) {
  try {
    let games = await Game.find({});
    return res.json(200, {
      data: {
        count: games.length,
        games,
      },
    });
  } catch (err) {
    console.log("error in getting all games controller ", err);
    return res.json(500, {
      data: {
        error: err,
      },
    });
  }
};

const Player = require("../models/player");

module.exports.createPlayer = async function (req, res) {
  try {
    let player = await Player.findOne({ email: req.body.email });
    if (!player) {
      player = await Player.create({
        name: req.body.name,
        email: req.body.email,
      });

      return res.status(200).json({
        data: {
          player: player,
        },
      });
    }

    return res.status(400).json({
      data: {
        message: `Player already exists with email ${req.body.email}`,
      },
    });
  } catch (err) {
    console.log("error in creating player controller ", err);
    return res.status(500).json({
      data: {
        error: err,
      },
    });
  }
};


module.exports.getAllPlayers = async function (req, res) {
    try {
      let players = await Player.find({});
      return res.status(200).json({
        data: {
          count:players.length,
          players,
        },
      });
    } catch (err) {
      console.log("error in getting all players controller ", err);
      return res.status(500).json({
        data: {
          error: err,
        },
      });
    }
  };
  
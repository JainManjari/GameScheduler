const Player = require("../models/player");

module.exports.createPlayer = async function (req, res) {
  try {
    let email = req.body.email;
    
    let player = await Player.findOne({ email: req.body.email });
    if (!player) {
      player = await Player.create({
        name: req.body.name,
        email: req.body.email,
      });

      const playerResponseDTO = {
        name: player.name,
        email: player.email,
      };

      return res.status(200).json({
        data: {
          player: playerResponseDTO,
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
    let players = await Player.find({}).sort({ createdAt: -1 });
    const playerResponseDTOs = [];
    for (let player of players) {
      const playerResponseDTO = {
        name: player.name,
        email: player.email,
      };
      playerResponseDTOs.push(playerResponseDTO);
    }
    return res.status(200).json({
      data: {
        count: players.length,
        players: playerResponseDTOs,
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

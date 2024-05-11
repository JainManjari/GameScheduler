const Player = require("../models/player");

module.exports.createPlayer = async function (req, res) {
  try {
    let player = await Player.findOne({ email: req.body.email });
    if (!player) {
      player = await Player.create({
        name: req.body.name,
        email: req.body.email,
      });

      return res.json(200, {
        data: {
          player: player,
        },
      });
    }

    return res.json(400, {
      data: {
        message: `Player already exists with email ${req.body.email}`,
      },
    });
  } catch (err) {
    console.log("error in creating player controller ", err);
    return res.json(500, {
      data: {
        error: err,
      },
    });
  }
};

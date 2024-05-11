const mongoose = require("mongoose");

const gameSchema = new mongoose.Schema(
  {
    players: {
      type: Number,
      required: true,
    },
    playerScores: [
      {
        type: Object,
        required: true,
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Game = mongoose.model("game", gameSchema);
module.exports = Game;

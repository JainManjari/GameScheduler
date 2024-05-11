const mongoose = require("mongoose");

const playerGameMappingSchema = new mongoose.Schema(
  {
    player: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Player",
    },
    gameScores: [
      {
        type: Object,
        required: true,
      },
    ],
    totalGames: {
      type: Number,
      required: true,
    },
    totalScore: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const PlayerGameMapping = mongoose.model(
  "playerGameMapping",
  playerGameMappingSchema
);
module.exports = PlayerGameMapping;

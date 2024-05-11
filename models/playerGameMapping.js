const { type } = require("express/lib/response");
const mongoose = require("mongoose");

const playerGameMappingSchema = new mongoose.Schema(
  {
    player: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Player",
    },
    playerName: {
      type: String,
      required: true,
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

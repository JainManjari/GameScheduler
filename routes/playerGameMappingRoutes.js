const express = require("express");
const router = express.Router();
const playerGameMappingController = require("../controller/playerGameMappingController");

console.log("player game mapping router loaded");

router.get("/", playerGameMappingController.recalibratePlayerGameMapping);
router.get("/top-players", playerGameMappingController.getTopPlayers);

module.exports = router;

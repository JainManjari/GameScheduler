const express = require("express");
const router = express.Router();
const playerGameMappingController = require("../controller/playerGameMappingController");

console.log("player game mapping router loaded");

router.get("/", playerGameMappingController.recalibratePlayerGameMapping);
router.get("/top-players", playerGameMappingController.getTopPlayers);
router.get("/top-players/all", playerGameMappingController.getAllTopPlayers);

module.exports = router;

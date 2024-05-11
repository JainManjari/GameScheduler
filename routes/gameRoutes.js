const express = require("express");
const router = express.Router();
const gameController = require("../controller/gameController");

console.log("game router loaded");

router.post("/", gameController.createGame);
router.get("/all", gameController.getAllGames);

module.exports = router;

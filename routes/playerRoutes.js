const express = require("express");
const router = express.Router();
const playerController = require("../controller/playerController");

console.log("player router loaded");

router.post("/", playerController.createPlayer);

module.exports = router;

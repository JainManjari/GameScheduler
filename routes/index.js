const express = require("express");
const router = express.Router();
const homeController = require("../controller/homeController");

console.log("router loaded");

router.get("/", homeController.home);
router.use("/players", require("./playerRoutes"));
router.use("/games", require("./gameRoutes"));

module.exports = router;

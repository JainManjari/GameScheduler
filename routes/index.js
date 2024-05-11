const express=require('express');
const router=express.Router();
const homeController = require('../controller/home');

console.log("router loaded");

router.get('/', homeController.home);
router.use("/players",require("./players"));

module.exports=router;
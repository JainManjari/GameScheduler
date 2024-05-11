const PlayerGameMapping = require("../models/playerGameMapping");

module.exports.home = async function (req, res) {
  try {
    let playerGameMapping = await PlayerGameMapping.find({})
      .sort({ totalScore: -1 })
      .limit(5);

    playerGameMapping = playerGameMapping.map((playerGameMap) => ({
      playerName: playerGameMap.playerName,
      totalGames: playerGameMap.totalGames,
      totalScore: playerGameMap.totalScore,
    }));
    return res.render("home", {
        topPlayers:playerGameMapping
    });
  } catch (error) {
    console.log("error in loading home controller ", error);
    return res.status(500).json({
      data: {
        error: error,
      },
    });
  }
};

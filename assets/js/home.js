const topPlayersDisplay = $("#top-5-players");

function fetchdata() {
  $.ajax({
    url: "/games/recalibrate/top-players",
    type: "get",
    success: function (data) {
      console.log(JSON.stringify(data));
      const playerGameMappings = data.playerGameMapping;
      if (playerGameMappings) {
        $("#top-5-players li").remove();
        for (let player of playerGameMappings) {
          topPlayersDisplay.append(
            `    <li>
            <div>
              <b>${player.playerName}</b>
              <br />
              <b>Total Score </b> ${player.totalScore}
              <br />
              <b>Total Games </b>: ${player.totalGames}
            </div>
          </li>`
          );
        }
      }
      console.log("completed rendering");
    },
    complete: function (data) {
      setTimeout(fetchdata, 20000);
    },
  }).fail(function (err) {
    console.log("access denied ", err);
  });
}
$(document).ready(function () {
  setTimeout(fetchdata, 20000);
});

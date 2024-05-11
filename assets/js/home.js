const topPlayersDisplay = $("#top-5-players");

function fetchdata() {
  $.ajax({
    url: "/games/recalibrate/top-players",
    type: "get",
    success: function (data) {
      console.log(JSON.stringify(data));
      const playerGameMappings = data.data.playerGameMapping;
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
        console.log("completed rendering");
      }
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

const createGameButton = $("#create-game");
const gameDisplay = $("#game-display");

createGameButton.on("click", function (e) {
  e.preventDefault();
  console.log("button clicked");
  $.ajax({
    url: "/games/",
    type: "post",
    success: function (data) {
      console.log(JSON.stringify(data));
      const playerScores = data.responseData.playerScores;
      let string = `<div style="border:1px solid;margin:10px;width:500px">`;
      if (playerScores) {
        for (let player of playerScores) {
          string += `   <li style="margin:20px;width:300px">
                  <b>${player.name}</b>
                  <b>Score </b> ${player.score}
                </li>`;
        }
        string.append += `</div>`;
        gameDisplay.append(string);
      }
    },
  }).fail(function (err) {
    console.log("access denied ", err);
  });
});

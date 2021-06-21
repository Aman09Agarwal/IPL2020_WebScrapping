const request = require("request");
const cheerio = require("cheerio");
const chalk = require("chalk");

function getMatchDetails(url) {
  request(url, cb);
}

function cb(err, res, html) {
  if (err) {
    console.log(err);
  } else {
    // console.log(html);
    extractMatchDetails(html);
  }
}

function extractMatchDetails(html) {
  let $ = cheerio.load(html);
  let descElem = $(".event .description");
  let result = $(".event .status-text");
  let stringArr = descElem.text().split(",");
  let venue = stringArr[1].trim();
  let date = stringArr[2].trim();
  result = result.text();
  let innings = $(".card.content-block.match-scorecard-table>.Collapsible");
  //   let htmlString = "";
  for (let i = 0; i < innings.length; i++) {
    //   htmlString += $(innings[i]).html();
    let teamName = $(innings[i]).find("h5").text();
    teamName = teamName.split("INNINGS")[0].trim();
    let opponentIndex = i == 0 ? 1 : 0;
    let opponentName = $(innings[opponentIndex]).find("h5").text();
    opponentName = opponentName.split("INNINGS")[0].trim();
    if (i == 0) {
      console.log(
        chalk.italic(`\n${venue} | ${date} | ${teamName} vs ${opponentName}\n`)
      );
    }
    if (i == 0) console.log(chalk.redBright(teamName));
    else console.log(chalk.blueBright(teamName));
    let cInnings = $(innings[i]);
    let allRows = cInnings.find(".table.batsman tbody tr");
    const matchDetails = [];
    for (let j = 0; j < allRows.length; j++) {
      let allCols = $(allRows[j]).find("td");
      let isWorthy = $(allCols[0]).hasClass("batsman-cell");
      if (isWorthy) {
        let playerName = $(allCols[0]).text().trim();
        let runs = $(allCols[2]).text().trim();
        let balls = $(allCols[3]).text().trim();
        let fours = $(allCols[5]).text().trim();
        let sixes = $(allCols[6]).text().trim();
        let sr = $(allCols[7]).text().trim();
        matchDetails.push({
          Player: playerName,
          Runs: runs,
          Balls: balls,
          Fours: fours,
          Sixes: sixes,
          SR: sr,
        });
      }
    }
    console.table(matchDetails);
  }
  console.log(chalk.yellowBright(`Match Summary : ${result}`));
}

module.exports = { getMatchDetails };

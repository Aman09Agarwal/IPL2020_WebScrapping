const sc = require("./scorecard");
const request = require("request");
const cheerio = require("cheerio");

function getAllMatchesLink(url) {
  request(url, function (err, res, html) {
    if (err) {
      console.log(err);
    } else {
      extractAllLinks(html);
    }
  });
}

function extractAllLinks(html) {
  let $ = cheerio.load(html);
  let scorecardElems = $("a[data-hover='Scorecard']");
  for (let i = 0; i < scorecardElems.length; i++) {
    let link = $(scorecardElems[i]).attr("href");
    // console.log(link);
    let fullLink = "https://www.espncricinfo.com" + link;
    //   console.log(fullLink);
    sc.getMatchDetails(fullLink);
  }
}

module.exports = { getAllMatchesLink };

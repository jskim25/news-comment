var axios = require("axios");
var cheerio = require("cheerio");

var scrape = function() {
  return axios.get("http://www.nytimes.com").then(function(res) {
    var $ = cheerio.load(res.data);
    var articles = [];

    $(".theme-summary").each(function(i, element) {
      var head = $(this).children(".story-heading").text().trim();
      var summary = $(this).children(".summary").text().trim();
      var url = $(this).children(".story-heading").children("a").attr("href");
      
      if (head && summary && url) {
        var newHeadline = head.replace(/(\r\n|\n|\r|\t|\s+)/gm, " ").trim();
        var newSummary = summary.replace(/(\r\n|\n|\r|\t|\s+)/gm, " ").trim();

        var dataToAdd = {
          headline: newHeadline,
          summary: newSummary,
          url: url
        };
        articles.push(dataToAdd);
      }
    });
    return articles;
  });
};

module.exports = scrape;

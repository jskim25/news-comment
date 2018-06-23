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
      
      if (head && sum && url) {
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

// var scrape = function() {
//   return axios.get("https://www.huffingtonpost.com/").then(function(res) {
//     var $ = cheerio.load(res.data);
//     var articles = [];

//     // Now, find and loop through each element that has the "theme-summary" class
//     // (i.e, the section holding the articles)
//     $(".card__content").each(function(i, element) {
//       // In each .theme-summary, we grab the child with the class story-heading

//       // Then we grab the inner text of the this element and store it
//       // to the head variable. This is the article headline
//       var head = $(this).children(".story-heading").text().trim();

//       // Grab the URL of the article
//       var url = $(this).children(".story-heading").children("a").attr("href");

//       // Then we grab any children with the class of summary and then grab it's inner text
//       // We store this to the sum variable. This is the article summary
//       var sum = $(this).children(".summary").text().trim();

//       // So long as our headline and sum and url aren't empty or undefined, do the following
//       if (head && sum && url) {
//         // This section uses regular expressions and the trim function to tidy our headlines and summaries
//         // We're removing extra lines, extra spacing, extra tabs, etc.. to increase to typographical cleanliness.
//         var newHeadline = head.replace(/(\r\n|\n|\r|\t|\s+)/gm, " ").trim();
//         var newSummary = sum.replace(/(\r\n|\n|\r|\t|\s+)/gm, " ").trim();

//         // Initialize an object we will push to the articles array

//         var dataToAdd = {
//           headline: newHeadline,
//           summary: newSummary,
//           url: url
//         };

//         articles.push(dataToAdd);
//       }
//     });
//     return articles;
//   });
// };

// Export the function, so other files in our backend can use it
module.exports = scrape;

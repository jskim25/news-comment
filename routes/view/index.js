var router = require("express").Router();

// homepage
router.get("/", function(req, res) {
  res.render("home");
});

// 'saved articles' page
router.get("/saved", function(req, res) {
  res.render("saved");
});

module.exports = router;

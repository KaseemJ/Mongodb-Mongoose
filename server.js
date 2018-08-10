// Require our dependencies
var express = require("express");
var mongoose = require("mongoose");
var exphbs = require("express-handlebars");
var bodyParser = require("body-parser");

// models route 
var db = require("./models");

// Set up our port to be either the host's designated port, or 3000
var PORT = process.env.PORT || 3000;

// Instantiate our Express App
var app = express();

// Designate our public folder as a static directory
app.use(express.static("public"));

// Connect Handlebars to our Express app
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

// Use bodyParser in our app
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// If deployed, use the deployed database. Otherwise use the local news database
var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/news";

// Connect to the Mongo DB
mongoose.connect(MONGODB_URI);

// GET all the articles that is set to false
// and render them to the index.handlebars page
app.get("/", function (req, res) {
  db.article.find({ article: false })
    .then(function (data) {
      // res.json(data);
      res.render("index", { article: data });
    }).catch(function (err) {
      res.status(404).send(err);
    });
});

// GET all the articles that is set to true
// and render them to the article.handlebars page
app.get("./article", function (req, res) {
  db.article.find({ favorite: true })
    .then(function (data) {
      // res.json(data);
      res.render("article", { article: data });
    }).catch(function (err) {
      res.status(404).send(err);
    });
});

// POST an Article to the mongo database
app.post("/api/index", function (req, res) {
  db.index.create(req.body)
    .then(function () {
      // res.json(dbIndex);
      res.redirect("/")
    }).catch(function (err) {
      res.status(400).send(err);
    });
});

// PUT (UPDATE) article by its _id 
// Will set the articles to whatever the value 
// of the req.body.article boolean is
app.put("/api/article/:id", function (req, res) {
  db.articles.findByIdAndUpdate(req.params.id, { favorite: req.body.article }, { new: true })
    .then(function (dbArticle) {
      res.json(dbArticle);
    }).catch(function (err) {
      res.status(400).send(err);
    });
});

// Listen on the port
app.listen(PORT, function () {
  console.log("Listening on port: " + PORT);
});
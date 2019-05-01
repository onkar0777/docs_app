global.__BASE__ = __dirname + "/";

var express = require("express");
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var CONFIG = require("./config/global");

var API_index = require("./api/index");
var API_request = require("./api/request");

var app = express();

mongoose.connect(
  `mongodb://${CONFIG.DB_URL}`, {
    useNewUrlParser: true,
    useCreateIndex: true
  },
  function (err) {
    if (err) {
      console.error("Database connection failed", err);
    } else {
      console.debug("Database connection successful");
    }
  }
);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded());

app.use(express.static("./public"));
app.set("view engine", "pug");

app.get("/", function (req, res) {
  res.render("index", {
    title: "Hey",
    message: "Hello there!"
  });
});

app.use("/api", API_index);
app.use("/api/request", API_request);

app.listen(CONFIG.PORT, function () {
  console.log("Server listening on port " + CONFIG.PORT);
});
global.__BASE__ = __dirname + "/";

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const CONFIG = require("./config/global");

const VIEW_ROUTES = require("./view-routes");
const API_index = require("./api/index");
const API_request = require("./api/request");

const app = express();

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

app.use("/api", API_index);
app.use("/api/request", API_request);

app.use("/", VIEW_ROUTES);

app.listen(CONFIG.PORT, function () {
  console.log("Server listening on port " + CONFIG.PORT);
});
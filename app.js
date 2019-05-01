global.__BASE__ = __dirname + "/";

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const CONFIG = require("./config/global");
const CronJob = require('cron').CronJob;

const VIEW_ROUTES = require("./view-routes");
const API_index = require("./api/index");
const API_request = require("./api/request");
const requestController = require(__BASE__ +
  "modules/controllers/requestController");
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
app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(express.static("dist"));

app.use("/api", API_index);
app.use("/api/request", API_request);

app.get("/*", (req, res) => {
  res.sendFile('index.html', {
    root: global.__BASE__ + "dist/"
  })
})

app.listen(CONFIG.PORT, function () {
  console.log("Server listening on port " + CONFIG.PORT);
});

new CronJob('0 */1 * * * *', requestController.completeRequestsCron, null, true);
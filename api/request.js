const express = require("express");
const router = express.Router();
const requestController = require(__BASE__ +
  "modules/controllers/requestController");

// Default route to get all the request. No input required
router.get("/", (req, res) => {
  requestController.getRequests().then(x => {
    res.send(x);
  }).catch(e => {
    res.send({
      status: "Failed to get",
      message: e.message,
    })
  });
});

// Default route to create a request. Need customer id as a mandatory param
router.post("/", (req, res) => {
  console.log(req.body);
  if (req.body.customer) {
    requestController.createRequest(req.body).then(x => {
        res.send(x);
      })
      .catch(e => {
        res.send({
          status: "Failed to create",
          message: e.message,
        })
      });
  } else {
    res.send("Invalid Inputs");
  }
});

module.exports = router;
const express = require("express");
const router = express.Router();
const requestController = require(__BASE__ +
  "modules/controllers/requestController");

// Default route to get all the request. No input required
router.get("/", (req, res) => {
  requestController.getRequests().then(x => {
    res.json(x);
  }).catch(e => {
    res.json({
      message: `Failed to get. ${e.message}`,
    })
  });
});

// Default route to create a request. Need customer id as a mandatory param
router.post("/", (req, res) => {
  console.log(req.body);
  if (req.body.customer) {
    requestController.createRequest(req.body).then(x => {
        res.json(x);
      })
      .catch(e => {
        res.json({
          message: `Failed to create. ${e.message}`,
        })
      });
  } else {
    res.json({
      message: "Invalid Inputs"
    });
  }
});

router.post("/select_request", (req, res) => {
  console.log(req.body);
  if (req.body.reqId && req.body.driver) {
    requestController.selectRequestByDriver(req.body.reqId, req.body.driver).then(x => {
        if (x === 'R_NA') {
          res.json({
            success: false,
            message: 'Request no longer available'
          });
        } else if (x === 'D_NA') {
          res.json({
            success: false,
            message: 'Driver Serving Another Request'
          });
        } else {
          res.json({
            success: true,
            data: x
          });
        }
      })
      .catch(e => {
        res.json({
          message: `Failed to update. ${e.message}`,
        })
      });
  } else {
    res.json({
      message: "Invalid Inputs"
    });
  }
});

router.get("/driver_requests", (req, res) => {
  console.log(req.query);
  if (req.query.driver) {
    requestController.getRequestsForDriver(req.query.driver).then(requests => {
      res.json(requests);
    }).catch(e => {
      res.json({
        message: `Failed to get. ${e.message}`,
      })
    });
  } else {
    res.json({
      message: `Failed to get. Invalid Inputs`,
    })
  }
});

module.exports = router;
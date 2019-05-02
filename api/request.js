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
  if (req.body.customer) {
    requestController.createRequest(req.body).then(x => {
        res.json({
          success: true,
          data: x,
          message: `Created Req Successfully for customer ${req.body.customer}`
        });
      })
      .catch(e => {
        res.json({
          success: false,
          message: `Failed to create. ${e.message}`,
        })
      });
  } else {
    res.json({
      message: "Invalid Inputs"
    });
  }
});

// api to select/accept a request by driver. Needs driver and request as body params.
// returns this map - {success: boolean, message: string if failed, data: if successful}
router.post("/select_request", (req, res) => {
  if (req.body.reqId && req.body.driver && req.body.driver <= 5) {
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
          success: false,
          message: `Failed to update. ${e.message}`,
        })
      });
  } else {
    res.json({
      success: false,
      message: "Invalid Inputs"
    });
  }
});

// api to get all driver requests. Needs driver as query param.
// returns {
//   waiting_requests: [],
//   ongoing_requests: [],
//   complete_requests: []
// }
router.get("/driver_requests", (req, res) => {
  if (req.query.driver && req.query.driver <= 5) {
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
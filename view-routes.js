// This is to serve the pug views and for all interaction with the views

const express = require("express");
const router = express.Router();
const requestController = require(__BASE__ +
    "modules/controllers/requestController");

router.get("/", function (req, res) {
    res.render("index", {
        title: "Hey",
        message: "Hello there!"
    });
});

router.post("/create_request", (req, res) => {
    console.log(req.body);
    if (req.body.customer) {
        requestController.createRequest(req.body).then(x => {
                res.render("customer", {
                    title: "Customer Form",
                    req_id: x._id
                });
            })
            .catch(e => {
                res.render("customer", {
                    title: "Customer Form",
                    error: e.message
                });
            });
    } else {
        res.render("customer", {
            title: "Customer Form",
            error: "Invalid Inputs"
        });
    }
});

router.get("/dashboard", function (req, res) {
    requestController.getRequests().then(x => {
        res.render("dashboard", {
            title: "Dashboard",
            request_data: x
        });
    }).catch(e => {
        res.render("dashboard", {
            title: "Dashboard",
            message: e.message,
            request_data: []
        });
    });

});

router.get("/customer", function (req, res) {
    res.render("customer", {
        title: "Customer Form",
    });
});

router.get("/driver", function (req, res) {
    requestController.getRequestsForDriver().then(requests => {
        console.log(requests);
        res.render("driver", {
            title: "Driver App",
            waiting_requests: requests.waiting_requests,
            ongoing_requests: requests.ongoing_requests,
            complete_requests: requests.complete_requests
        });
    }).catch(e => {
        res.render("driver", {
            title: "Driver App",
            message: e.message,
            request_data: []
        });
    });

});

module.exports = router;
// Controller for Requests. All the business logic should be here
const mongoose = require('mongoose');
const moment = require('moment');
const requestAccessor = require(__BASE__ +
  "modules/database/accessors/requestAccessor");
const REQUEST_STATUS = require(__BASE__ + "config/enums").REQUEST_STATUS;

const getRequests = function (query) {
  return requestAccessor.getRequests(query, undefined, {
    sort: {
      _id: -1
    }
  });
};

const createRequest = function (params) {
  return requestAccessor.createRequest(params);
}

// get all the requests for a specific driver. needs driver id
// returns map of waiting, ongoing and completed requests
const getRequestsForDriver = async function (driver) {
  const requests = await requestAccessor.getRequests({}, undefined, {
    sort: {
      _id: -1
    }
  });
  const waiting_requests = requests.filter(req => req.status === REQUEST_STATUS.WAITING);
  const ongoing_requests = requests.filter(req => {
    return req.status === REQUEST_STATUS.ONGOING && req.driver === driver
  });
  const complete_requests = requests.filter(req => req.status === REQUEST_STATUS.COMPLETE && req.driver === driver);
  return {
    waiting_requests,
    ongoing_requests,
    complete_requests
  }
};

// Accept the request by a driver. Accepts request id and driver id. 
// Checks if reques and driver available. If available accepts request
const selectRequestByDriver = async function (reqId, driver) {
  const request_ongoing = await requestAccessor.getRequests({
    driver: driver,
    status: REQUEST_STATUS.ONGOING
  });
  const request_wait = await requestAccessor.getRequests({
    _id: mongoose.Types.ObjectId(reqId),
    status: REQUEST_STATUS.WAITING
  });
  if (!(request_wait && request_wait.length)) {
    return "R_NA"
  } else if (request_ongoing && request_ongoing.length) {
    return "D_NA"
  } else {
    return requestAccessor.updateRequest({
      _id: mongoose.Types.ObjectId(reqId)
    }, {
      driver: driver,
      status: REQUEST_STATUS.ONGOING,
      accepted_at: new Date()
    })
  }
}

// Function which completes all the requests accepted five minutes ago
const completeOngoingRequests = function () {
  requestAccessor.updateManyRequests({
    status: REQUEST_STATUS.ONGOING,
    accepted_at: {
      $lte: moment().subtract(5, "m")
    }
  }, {
    status: REQUEST_STATUS.COMPLETE,
    completed_at: new Date()
  }).then(arr => {
    console.log("Updated through cron", arr);
  })
}

module.exports = {
  getRequests: getRequests,
  createRequest: createRequest,
  getRequestsForDriver: getRequestsForDriver,
  selectRequestByDriver: selectRequestByDriver,
  completeOngoingRequests: completeOngoingRequests
};
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

const getRequestsForDriver = async function (driver) {
  const requests = await requestAccessor.getRequests({}, undefined, {
    sort: {
      _id: -1
    }
  });
  const waiting_requests = requests.filter(req => req.status === REQUEST_STATUS.WAITING);
  const ongoing_requests = requests.filter(req => {
    console.log("check - ", req.status === REQUEST_STATUS.ONGOING && req.driver === driver, req.driver, driver, req.driver === driver);
    return req.status === REQUEST_STATUS.ONGOING && req.driver === driver
  });
  const complete_requests = requests.filter(req => req.status === REQUEST_STATUS.COMPLETE && req.driver === driver);
  return {
    waiting_requests,
    ongoing_requests,
    complete_requests
  }
};

const selectRequestByDriver = async function (reqId, driver) {
  const request_ongoing = await requestAccessor.getRequests({
    driver: driver,
    status: REQUEST_STATUS.ONGOING
  });
  const request_wait = await requestAccessor.getRequests({
    _id: mongoose.Types.ObjectId(reqId),
    status: REQUEST_STATUS.WAITING
  });
  console.log(request_wait);
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

const completeRequestsCron = function () {
  console.log(new Date(moment().subtract(5, "m")));
  requestAccessor.updateManyRequests({
    status: REQUEST_STATUS.ONGOING,
    accepted_at: {
      $lte: moment().subtract(5, "m")
    }
  }, {
    status: REQUEST_STATUS.COMPLETE
  }).then(arr => {
    console.log(arr);
  })
}

module.exports = {
  getRequests: getRequests,
  createRequest: createRequest,
  getRequestsForDriver: getRequestsForDriver,
  selectRequestByDriver: selectRequestByDriver,
  completeRequestsCron: completeRequestsCron
};
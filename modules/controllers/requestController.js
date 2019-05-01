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
  const ongoing_requests = requests.filter(req => req.status === REQUEST_STATUS.ONGOING && req.driver === driver);
  const complete_requests = requests.filter(req => req.status === REQUEST_STATUS.COMPLETE && req.driver === driver);
  return {
    waiting_requests,
    ongoing_requests,
    complete_requests
  }
};

module.exports = {
  getRequests: getRequests,
  createRequest: createRequest,
  getRequestsForDriver: getRequestsForDriver
};
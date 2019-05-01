const requestAccessor = require(__BASE__ +
  "modules/database/accessors/requestAccessor");

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

module.exports = {
  getRequests: getRequests,
  createRequest: createRequest,
};
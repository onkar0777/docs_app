var Request = require(__BASE__ + "modules/database/models/request");
var Promise = require("bluebird");
var REQUEST_STATUS = require(__BASE__ + "config/enums").REQUEST_STATUS;


var getCreateTemplate = function (parameters) {
  var template = {};
  for (var key in parameters) {
    switch (key) {
      case "customer":
      case "location":
        template[key] = parameters[key];
        break;
    }
  }
  template.status = REQUEST_STATUS.WAITING;
  template.created_at = new Date();
  return template;
};

const getRequests = function (rule, fields, options) {
  return new Promise(function (resolve, reject) {
    Request.find(rule, fields, options)
      .lean()
      .exec(function (err, data) {
        if (!err) {
          console.log(data);
          resolve(data);
        } else {
          console.error("GetRequests", err, rule);
          reject(err);
        }
      });
  });
};

const createRequest = function (parameters) {
  return new Promise(function (resolve, reject) {
    var template = getCreateTemplate(parameters);
    var record = new Request(template);
    record.save(function (err, data) {
      if (!err) {
        resolve(data);
      } else {
        console.error("CreateRequest", err, template);
        reject(err);
      }
    });
  });
};

const updateRequest = function (rule, template) {
  return new Promise(function (resolve, reject) {
    Request.findOneAndUpdate(rule, {
      '$set': template
    }, {
      upsert: false,
      new: true,
      runValidators: true
    }, function (err, data) {
      // multi is false by default
      if (!err) {
        resolve(data);
      } else {
        console.error("updateUser", err, rule, template);
        reject(err);
      }
    });
  });
};

const updateManyRequests = function (rule, template) {
  return new Promise(function (resolve, reject) {
    Request.updateMany(rule, {
      '$set': template
    }, {
      upsert: false,
      runValidators: true
    }, function (err, data) {
      // multi is false by default
      if (!err) {
        resolve(data);
      } else {
        console.error("updateUser", err, rule, template);
        reject(err);
      }
    });
  });
};


module.exports = {
  getRequests: getRequests,
  createRequest: createRequest,
  updateRequest: updateRequest,
  updateManyRequests: updateManyRequests
};
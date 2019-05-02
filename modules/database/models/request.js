const mongoose = require("mongoose");
const REQUEST_STATUS = require(__BASE__ + "config/enums").REQUEST_STATUS;

const RequestSchema = new mongoose.Schema({
  //_id: Object,

  customer: { // Id of the customer who created the request
    type: String,
    required: true
  },
  driver: String, // Id of the driver who accepted the request

  // current status of the request. can be anything in the enum
  status: {
    type: String,
    enum: [
      REQUEST_STATUS.WAITING,
      REQUEST_STATUS.ONGOING,
      REQUEST_STATUS.COMPLETE
    ],
    required: true
  },
  // For future use to store the location of the customer
  location: {
    lat: String,
    long: String
  },
  // timestamp for creation of request
  created_at: {
    type: Date,
    default: Date.now,
    required: true
  },
  // timestamp for accepting of request
  accepted_at: {
    type: Date,
  },
  // timestamp for Completiom of request
  completed_at: {
    type: Date,
  }
}, {
  minimize: false
});

RequestSchema.index({
  driverId: 1
}); // we will be querying requests for each driver, hence the index. future-safe!

module.exports = mongoose.model("Request", RequestSchema);
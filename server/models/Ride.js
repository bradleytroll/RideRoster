const mongoose = require('mongoose');

const rideSchema = new mongoose.Schema({
  name: { type: String, required: true },
  park: { type: String, required: true },
  dateRidden: { type: Date, required: true },
  rating: { type: Number, min: 1, max: 5 },
  review: { type: String },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
});

const Ride = mongoose.model('Ride', rideSchema);
module.exports = Ride;

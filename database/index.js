const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/jot', {useNewUrlParser: true, useFindAndModify: false, useUnifiedTopology: true });
const db = mongoose.connection;
db.on('error', function() {
  console.log('Mongoose connection error');
});
db.once('open', function() {
  console.log('Mongoose connected successfully');
});

const tripSchema = mongoose.Schema({
  username: String,
  tripName: String,
  notes: Array //[ {title: String, contents: String} ]
}, {timestamps: true});
const Trip = mongoose.model('Trip', tripSchema);

function getTrips(user) {
  return Trip.find(user).exec(); // todo: sort by updatedAt, return newest first
};

function createTrip(trip) {
  return Trip.create(trip);
};

function createNote(tripId, note) {
  return Trip.findByIdAndUpdate(tripId, {$push: {notes: note}}).exec();
};

module.exports.getTrips = getTrips;
module.exports.createTrip = createTrip;
module.exports.createNote = createNote;

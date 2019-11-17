const mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
mongoose.connect('mongodb://localhost/jot', {useNewUrlParser: true});
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
  notes: [ {title: String, contents: String} ]
});
const Trip = mongoose.model('Trip', tripSchema);

function getTrips(user) {
  return Trip.find(user).exec();
};

function createTrip(trip) {
  return Trip.create(trip);
};

// function createNote(tripId, note) {
//   return Trip.findById(tripId, (err, trip) => {
//     var notes = trip.notes;
//     resolve(trip.notes);
//   })
//   .exec((notes) => {
//   })
//   .then((trip) => {
//     // add note & save
//   })
//   .catch((err) => {
//     console.log('Error: ', err);
//   });
// };

module.exports.getTrips = getTrips;
module.exports.createTrip = createTrip;
// module.exports.createNote = createNote;

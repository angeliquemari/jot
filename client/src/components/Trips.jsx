import React from 'react';

export default function Trips({trips, addTrip, selectTrip}) {
  return (
    <div>
      <h3>Trips</h3>
      <button onClick={addTrip}>Add trip</button>
      {trips.map(trip => <div key={trip._id} tripid={trip._id} onClick={selectTrip}>{trip.tripName}</div>)}
    </div>
  );
};

import React from 'react';

export default function Trips({trips}) {
  return (
    <div>
      <h3>Trips</h3>
      {trips.map(trip => <div key={trip._id}>{trip.tripName}</div>)}
    </div>
  );
};

import React from 'react';

export interface Props {
  trips: any[]
}

export function Trips(props: Props) {
  return (
    <div>
      {props.trips.map(trip => {
        return (
          <div key={trip._id} >{trip.tripName}</div>
        );
      })}
    </div>
  );
}

export default Trips;

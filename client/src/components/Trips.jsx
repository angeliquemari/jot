import React from 'react';
import styles from './styles/trips.css';

export default function Trips({trips, addTrip, selectTrip}) {
  return (
    <div className={styles.tripsContainer}>
      <div className={styles.titleSection}>
        <h3>Trips</h3>
        <button className={styles.addTripButton} onClick={addTrip}>Add</button>
      </div>
      {trips.map(trip => {
        return (
          <div className={styles.tripContainer} key={trip._id} >
            <div className={styles.trip} tripid={trip._id} onClick={selectTrip}>
              {trip.tripName}
            </div>
          </div>
        );
      })}
    </div>
  );
};

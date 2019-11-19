import React from 'react';
import styles from './styles/trips.css';

export default function Trips({trips, addTrip, deleteTrip, selectTrip, selectedTrip}) {
  return (
    <div className={styles.tripsContainer}>
      <div className={styles.titleSection}>
        <h3>Trips</h3>
        <button onClick={deleteTrip}>-</button>
        <button onClick={addTrip}>+</button>
      </div>
      {trips.map(trip => {
        return (
          <div className={styles.tripContainer} key={trip._id} >
            <button tripid={trip._id} onClick={selectTrip} disabled={trip._id === selectedTrip._id}>
              {trip.tripName}
            </button>
          </div>
        );
      })}
    </div>
  );
};

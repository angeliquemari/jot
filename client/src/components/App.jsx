import React from 'react';
import $ from 'jquery';
import Trips from './Trips';
import Notes from './Notes';
import Note from './Note';

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      trips: [],
      selectedTrip: undefined,
      selectedNote: undefined
    };
    this.addTrip = this.addTrip.bind(this);
  }

  addTrip(e) {
    e.preventDefault;
    let tripName = prompt('Please enter a name for your trip:');
    $.ajax({
      type: 'POST',
      url: '/trips',
      contentType: 'application/json',
      data: JSON.stringify({tripName: tripName}),
      success: () => {
        this.getTrips()
      }
    });
  }

  getTrips() {
    $.get('/trips', (trips) => {
      this.setState({
        trips: trips,
        selectedTrip: (trips.length) ? trips[0] : undefined,
        selectedNote: (trips.length && trips[0].notes.length) ? trips[0].notes[0] : undefined
      });
    });
  }

  componentDidMount() {
    this.getTrips();
  }

  render() {
    return (
      <div>
        <Trips trips={this.state.trips} addTrip={this.addTrip} />
        {this.state.selectedTrip !== undefined && <Notes notes={this.state.selectedTrip.notes} />}
        {this.state.selectedTrip !== undefined && this.state.selectedNote !== undefined && <Note note={this.state.selectedNote} />}
      </div>
    );
  }
}

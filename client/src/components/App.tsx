import React from 'react';
import $ from 'jquery';
import Trips from './Trips';
import Notes from './Notes';
// import Note from './Note';

export interface Note {
  note: {
    _id: string,
    title: string,
    contents: string
  }
}
export interface Trip {
  trip: {
    _id: string,
    username: string,
    tripName: string,
    notes: Note['note'][],
    createdAt: Date,
    updatedAt: Date,
    __v: number
  }
}
export interface State {
  trips: Trip['trip'][],
  selectedTrip: any,
  selectedNote: any
}

export class App extends React.Component<{}, State> {
  state: State = {
      trips: [],
      selectedTrip: undefined,
      selectedNote: undefined
  }

  componentDidMount() {
    $.get('/trips', (trips: State['trips']) => {
      this.setState({
        trips: trips,
        selectedTrip: (trips.length) ? trips[0] : undefined,
        selectedNote: (trips.length && trips[0].notes.length) ? trips[0].notes[0] : undefined,
      });
    });
  }

  render() {
    return (
      <div>
        <Trips trips={this.state.trips}/>
      </div>
    );
  }
}

export default App;

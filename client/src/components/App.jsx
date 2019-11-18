import React from 'react';

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      trips: [],
      selectedTrip: undefined,
      selectedNote: undefined
    };
  }

  componentDidMount() {
    // 
  }

  render() {
    return <div>test</div>;
  }
}

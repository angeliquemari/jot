import * as React from 'react';
import $ from 'jquery';
import Trips from './Trips';

export interface Props {}
export interface State {
  trips: any[]
}

export class App extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      trips: []
    };
  }

  componentDidMount() {
    $.get('/trips', (trips: Array<object>) => {
      this.setState({
        trips: trips
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

import * as React from 'react';

export interface AppProps { compiler: string; framework: string; }

export class App extends React.Component<AppProps, {}> {
  render() {
    return <div>Compiler: {this.props.compiler}, Framework: {this.props.framework}</div>;
  }
}

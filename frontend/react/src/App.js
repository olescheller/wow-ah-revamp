import React, { Component } from 'react';
import {connect} from "react-redux";
import {incrementAction} from "./actions";
import {incrementThunk} from "./thunks";
import SellOrderEntry from "./SellOrderEntry";


class App extends Component {

  handleClick = () => {
    this.props.dispatch(incrementAction());
  };

  handleClickAsync = () => {
    this.props.dispatch(incrementThunk("my", [1,2,3]))
  };

  render() {
    return (
          <div className="App">
            <header className="App-header">
            <p>Count: {this.props.count}</p>
              <button onClick={this.handleClick}>+</button>
              <button onClick={this.handleClickAsync}>+ (async)</button>
                <SellOrderEntry></SellOrderEntry>
            </header>
          </div>
    );
  }
}

export default connect(({count})=>({count}))(App);

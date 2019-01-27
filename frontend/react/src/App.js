import React, {Component} from 'react';
import {connect} from "react-redux";
import {incrementAction} from "./actions";
import {incrementThunk} from "./thunks";
import SellOrderList from "./SellOrderList";
import CategorySelector from "./CategorySelector";
import MiniDrawer from "./MiniDrawer";


class App extends Component {


    render() {
        return (
            <div className="App">
                <MiniDrawer/>
            </div>
        );
    }
}

export default connect(({count}) => ({count}))(App);

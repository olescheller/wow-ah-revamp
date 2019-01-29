import React, {Component} from 'react';
import {connect} from "react-redux";
import DrawerLayout from "./DrawerLayout";


class App extends Component {


    render() {
        return (
            <div className="App">
                <DrawerLayout/>
            </div>
        );
    }
}

export default connect(({count}) => ({count}))(App);

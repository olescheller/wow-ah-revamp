import React, {Component} from 'react';
import {connect} from "react-redux";
import DrawerLayout from "./DrawerLayout";
import {withRouter} from "react-router-dom";


class App extends Component {


    render() {
        return (
            <div className="App">
                <DrawerLayout/>
            </div>
        );
    }
}

export default withRouter(connect(({count}) => ({count}))(App));

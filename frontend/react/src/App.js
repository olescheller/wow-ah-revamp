import React, {Component} from 'react';
import DrawerLayout from "./components/DrawerLayout";
import {randomItemsRequested} from "./redux/actions/itemActions";
import {connect} from "react-redux";


class App extends Component {

    render() {
        return (
            <div className="App">
                <DrawerLayout/>
            </div>
        );
    }
}

export default App;

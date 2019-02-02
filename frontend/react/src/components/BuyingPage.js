import * as React from "react";
import {Paper} from "@material-ui/core";
import Typography from "@material-ui/core/Typography";
import SellOrderList from "./SellOrderList";
import LinearQuery from './loadingBar';

class BuyingPage extends React.Component{
    render(){
        return (
            <div>
                <LinearQuery></LinearQuery>
                <SellOrderList/>
            </div>
        )
    }
}

export default BuyingPage;
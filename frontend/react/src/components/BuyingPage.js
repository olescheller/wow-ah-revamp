import * as React from "react";
import {Paper} from "@material-ui/core";
import Typography from "@material-ui/core/Typography";
import SellOrderList from "./SellOrderList";

class BuyingPage extends React.Component{
    render(){
        return (
            <div>
                <SellOrderList/>
            </div>
        )
    }
}

export default BuyingPage;
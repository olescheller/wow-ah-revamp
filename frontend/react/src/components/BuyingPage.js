import * as React from "react";
import SellOrderList from "./SellOrderList";
import LinearQuery from './LoadingBar';

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
import * as React from "react";
import SellOrderList from "./SellOrderList";
import LinearQuery from './LoadingBar';
import getReceipt from './SubscriptionComponent';
import {itemSupplyRequestAction} from "../redux/actions/itemActions";
import connect from "react-redux/es/connect/connect";

class BuyingPage extends React.Component{

    componentDidMount() {
        this.props.dispatch(itemSupplyRequestAction(this.props.searchTerm))
    }

    render(){
        return (
            <div>
                <LinearQuery></LinearQuery>
                <SellOrderList/>
            </div>
        )
    }
}

export default connect(({searchTerm}) => ({searchTerm}))(BuyingPage);
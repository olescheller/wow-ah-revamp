import * as React from "react";
import InventoryGrid from "./InventoryGrid";
import ActiveSellOrders from "./ActiveSellOrders";

class SellingPage extends React.Component{
    render(){
        return (
            <div>
                <InventoryGrid/>
                <ActiveSellOrders/>
            </div>
        )
    }
}

export default SellingPage;
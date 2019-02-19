import React from 'react';
import gql from 'graphql-tag';
import Subscription from "react-apollo/Subscriptions";
import MoneyView from "./MoneyView";
import CustomizedSnackbar from "./SnackBar";


// subscription{
//     receipt(itemId: 25){
//         item {
//             name
//             id
//         }
//         price
//         money
//         amount
//     }
// }

const RECEIPT_SUBSCRIPTION = gql`
  subscription onReceipt($itemId: Int!) {
    receipt(itemId: $itemId) {
        item {
            name
            id
         }
        price
        min_price
        money
        amount
    }
  }
`;

const SELL_ORDER_ALERT_SUBSCRIPTION = gql`
  subscription onSellOrderAlert($sellerName: String!) {
    sellOrderAlert(sellerName: $sellerName) {
      sellerName
      itemName
      amount
    }
  }
`;

export const ReceiptSubscription = (itemSupply, type) => {
    const itemId = parseInt(itemSupply.item.id);
    return (
    <Subscription
        subscription={RECEIPT_SUBSCRIPTION}
        variables={{itemId}}
        shouldResubscribe={true}
    >
        {({ data, loading, error }) => {
            if(!loading && data.receipt.amount && data.receipt.min_price) {
                return (type === "QUANTITY") ? data.receipt.amount : (type === "PRICE") ? <MoneyView  displayClass="coins-block"  money={data.receipt.min_price} /> : 0;
            }
            return(type === "QUANTITY") ? itemSupply.quantity : (type === "PRICE") ? <MoneyView displayClass="coins-block" money={itemSupply.min_price} /> : 0;
        }}
    </Subscription>
)};


export const SellOrderAlertSubscription = (sellerName) => {
    return (
        <Subscription
            subscription={SELL_ORDER_ALERT_SUBSCRIPTION}
            variables={{sellerName}}
            shouldResubscribe={true}
        >
            {({ data, loading, error }) => {
                if(!loading && data.sellOrderAlert) {
                    const userSellOrders = data.sellOrderAlert.filter(alert => {
                        return alert.sellerName === sellerName
                    }).map(alert => {

                        return (<CustomizedSnackbar variant="success" message = {`You sold ${alert.amount} pieces of ${alert.itemName}`}/>)
                    })
                    return userSellOrders;
                }
                return <div></div>
            }}
        </Subscription>
    )
};
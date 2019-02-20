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

export const ReceiptSubscription = (itemSupply, type, callback) => {
    const itemId = parseInt(itemSupply.item.id);
    return (
    <Subscription
        subscription={RECEIPT_SUBSCRIPTION}
        variables={{itemId}}
        shouldResubscribe={true}
        onSubscriptionData={(data) => {
            const receipt = data.subscriptionData.data.receipt;
            callback(receipt);
        }}
    >
        {({ data, loading, error }) => {
            return ''
        }}
    </Subscription>
)};


export const SellOrderAlertSubscription = (sellerName, callback) => {
    return (
        <Subscription
            subscription={SELL_ORDER_ALERT_SUBSCRIPTION}
            variables={{sellerName}}
            shouldResubscribe={true}
            onSubscriptionData={(data) => {
                const alerts = data.subscriptionData.data.sellOrderAlert.filter(alert => alert.sellerName === sellerName);
                callback(...alerts);
            }}
        >
            {({ data, loading, error }) => {
                return ''
            }}
        </Subscription>
    )
};
import React from 'react';
import gql from 'graphql-tag';
import Subscription from "react-apollo/Subscriptions";
import MoneyView from "./MoneyView";


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

const ReceiptSubscription = (itemSupply, type) => {
    const itemId = parseInt(itemSupply.item.id);
    return (
    <Subscription
        subscription={RECEIPT_SUBSCRIPTION}
        variables={{itemId}}
        shouldResubscribe={true}
    >
        {({ data, loading, error }) => {
            if(!loading && data.receipt.amount && data.receipt.min_price) {
                //change quantity in store and refer to quantity in store
                return (type === "QUANTITY") ? data.receipt.amount : (type === "PRICE") ? <MoneyView  displayClass="coins-block"  money={data.receipt.min_price} /> : 0;
            }
            return(type === "QUANTITY") ? itemSupply.quantity : (type === "PRICE") ? <MoneyView displayClass="coins-block" money={itemSupply.min_price} /> : 0;
        }}
    </Subscription>
)};

export default ReceiptSubscription;
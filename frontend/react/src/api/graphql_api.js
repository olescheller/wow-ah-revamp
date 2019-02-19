import axios from 'axios'
import gql from 'graphql-tag';

export const BUY_SUBSCRIPTION = gql`
    subscription receipt($itemId: Int!) {
        receipt(itemId: $itemId) {
            itemId
            price
            amount
            money
        }
    }`;

export async function makePurchase(userName, itemId, amount, total, perUnit) {
    return new Promise((resolve, reject) => {
        const mutation = `mutation {buyItems(userName: "Elandura-Silvermoon", itemId: ${itemId},amount: ${amount}, total: ${total}, perUnit: ${perUnit}) 
        {money, amount, item{id, name, item_class{ name }, item_sub_class{name}, icon},price}}`;
        axios.post("http://localhost:4000/", {"query": mutation, operationName: null, variables: {}}).then(response => {
            console.log(response.data.data.buyItems)
            resolve(response.data.data.buyItems);
        })
    })
}

export async function createSellOrder(itemId, price, quantity) {
    return new Promise((resolve, reject) => {
        const mutation = `mutation {createSellOrder(itemId: ${itemId}, price: ${price}, quantity: ${quantity}, seller_name: "Elandura", seller_realm:"Silvermoon") {
        item {id, name, item_class {name}, icon}, price, quantity} }`;
        axios.post("http://localhost:4000/", {"query": mutation, operationName: null, variables: {}}).then(response => {
            resolve(response.data.data.createSellOrder);
        })
    });
}



export async function addItemToSellOrder(itemId, quantity) {
    return new Promise((resolve, reject) => {
        const mutation = `mutation {addItemToSellOrder(itemId: ${itemId}, quantity: ${quantity}, seller_name: "Elandura", seller_realm:"Silvermoon") {
        item {id, name, item_class {name}, icon}, price, quantity} }`;
        axios.post("http://localhost:4000/", {"query": mutation, operationName: null, variables: {}}).then(response => {
            resolve(response.data.data.addItemToSellOrder);
        })
    });
}

export async function removeSellOrder(itemId) {
    console.log(itemId)
    return new Promise((resolve, reject) => {
        const mutation = `mutation {removeSellOrder(itemId: ${itemId}, seller_name: "Elandura", seller_realm:"Silvermoon")}`;
        axios.post("http://localhost:4000/", {"query": mutation, operationName: null, variables: {}}).then(response => {
            resolve(response.data.data.removeSellOrder);
        })
    });
}


export async function downloadRandomItems() {
    // console.log('request')
    return new Promise((resolve, reject) => {
        const qry = `{randomItems{quantity, item {id, name, icon, item_class{name},item_sub_class{name}}}}`;
        axios.post("http://localhost:4000/", {"query": qry}).then(response => {
            // console.log({response})
            resolve(response.data.data.randomItems);
        })
    })

}

export async function downloadAverageItemPrice(itemId, amount) {
    console.log({itemId, amount})
    return new Promise((resolve, reject) => {
        const qry = `{items_price(itemId: ${itemId}, amount: ${amount}) {perUnit, total}}`;
        axios.post("http://localhost:4000/", {"query": qry}).then(response => {

            resolve(response.data.data.items_price);
        })
    })
}

export async function fetchAmountOfItemSupplies(partialName) {
    return new Promise((resolve, reject) => {
        const qry = `{items_count(partialItemName: \"${partialName}\")}`;
        axios.post("http://localhost:4000/", {"query": qry}).then(response => {

            resolve(response.data.data.items_count);
        })
    })
}

export async function downloadItemsSupplyByPartialName(partialName) {

    return new Promise((resolve, reject) => {
        const qry = `{items_supply(partialItemName: \"${partialName}\") { item {id name icon}, min_price quantity}}`;
        axios.post("http://localhost:4000/", {"query": qry}).then(response => {

            resolve(response.data.data.items_supply.filter(item => item!==null))
        })
    })
}
export async function getUserMoney(userName, realmName) {
    return new Promise((resolve, reject) => {
        const qry = `
              {
                user(name: \"${userName}\", realm: \"${realmName}\" ) {
                  name,
                  money
                }
              }
            `;
        axios.post("http://localhost:4000/", {"query": qry}).then(response => {
            resolve(response.data.data.user)
        })
    })
}
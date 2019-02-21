import axios from 'axios'
import gql from 'graphql-tag';

let server="";
if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
     server = 'localhost';
    // dev code
} else {
     server = 'ec2-35-156-213-231.eu-central-1.compute.amazonaws.com';
}

export const CHANGE_ITEM_SUPPLY_SUBSCRIPTION = gql`
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
        const mutation = `mutation {buyItems(userName: "${userName}", itemId: ${itemId},amount: ${amount}, total: ${total}, perUnit: ${perUnit}) 
        {money, amount, amountBought, item{id, name, item_class{ name }, item_sub_class{name}, icon},price}}`;
        axios.post(`http://${server}:4000/`, {"query": mutation, operationName: null, variables: {}}).then(response => {
            resolve(response.data.data.buyItems);
        })
    })
}

export async function createSellOrder(itemId, price, quantity,  seller_name, seller_realm) {
    return new Promise((resolve, reject) => {
        const mutation = `mutation {createSellOrder(itemId: ${itemId},  seller_name: "${seller_name}", seller_realm: "${seller_realm}", price: ${price}, quantity: ${quantity}) {
        item {id, name, item_class {name}, icon,  item_sub_class{name}}, price, quantity} }`;
        axios.post(`http://${server}:4000/`, {"query": mutation, operationName: null, variables: {}}).then(response => {
            resolve(response.data.data.createSellOrder);
        })
    });
}



export async function addItemToSellOrder(itemId, quantity, seller_name, seller_realm) {
    return new Promise((resolve, reject) => {
        const mutation = `mutation {addItemToSellOrder(itemId: ${itemId}, quantity: ${quantity}, seller_name: "${seller_name}", seller_realm: "${seller_realm}") {
        item {id, name, item_class {name}, icon, item_sub_class{name}}, price, quantity} }`;
        axios.post(`http://${server}:4000/`, {"query": mutation, operationName: null, variables: {}}).then(response => {
            resolve(response.data.data.addItemToSellOrder);
        })
    });
}

export async function removeSellOrder(itemId, seller_name, seller_realm) {
    return new Promise((resolve, reject) => {
        const mutation = `mutation {removeSellOrder(itemId: ${itemId},  seller_name: "${seller_name}", seller_realm: "${seller_realm}")}`;
        axios.post(`http://${server}:4000/`, {"query": mutation, operationName: null, variables: {}}).then(response => {
            resolve(response.data.data.removeSellOrder);
        })
    });
}


export async function downloadRandomItems() {
    return new Promise((resolve, reject) => {
        const qry = `{randomItems{quantity, item {id, name, icon, item_class{name},item_sub_class{name}}}}`;
        axios.post(`http://${server}:4000/`, {"query": qry}).then(response => {
            resolve(response.data.data.randomItems);
        })
    })

}

export async function downloadAverageItemPrice(itemId, amount) {
    return new Promise((resolve, reject) => {
        const qry = `{items_price(itemId: ${itemId}, amount: ${amount}) {perUnit, total}}`;
        axios.post(`http://${server}:4000/`, {"query": qry}).then(response => {

            resolve(response.data.data.items_price);
        })
    })
}

export async function fetchAmountOfItemSupplies(partialName) {
    return new Promise((resolve, reject) => {
        const qry = `{items_count(partialItemName: \"${partialName}\")}`;
        axios.post(`http://${server}:4000/`, {"query": qry}).then(response => {

            resolve(response.data.data.items_count);
        })
    })
}

export async function downloadItemsSupplyByPartialName(partialName) {

    return new Promise((resolve, reject) => {
        const qry = `{items_supply(partialItemName: \"${partialName}\") { item {id name icon}, min_price quantity}}`;
        axios.post(`http://${server}:4000/`, {"query": qry}).then(response => {

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
        axios.post(`http://${server}:4000/`, {"query": qry}).then(response => {
            resolve(response.data.data.user)
        })
    })
}export async function getUserSellOrder(userName, realmName) {
    return new Promise((resolve, reject) => {
        const qry = `
              {
                sell_order(userName: \"${userName}\", realmName: \"${realmName}\" ) 
                {
                    item{
                      name
                      icon
                      id
                      item_class {
                         name
                      }
                      item_sub_class {
                        name
                      }
                    }
                    quantity
                    price
                 }
             }`;
        axios.post(`http://${server}:4000/`, {"query": qry}).then(response => {
            resolve(response.data.data.sell_order)
        })
    })
}
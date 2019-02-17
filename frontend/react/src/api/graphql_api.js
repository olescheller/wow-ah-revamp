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

export const dummyApiCall = (id) => {
    return new Promise((resolve, reject) => {
        setTimeout(() => resolve([
            {
                "item": {
                    "icon": "inv_fabric_wool_01",
                    "id": "2592",
                    "name": "Wool Cloth"
                },
                "quantity": 6794,
                "min_price": 1969
            },
            {

                "item": {
                    "icon": "inv_misc_flower_02",
                    "id": "2447",
                    "name": "Peacebloom"
                },
                "quantity": 5334,
                "min_price": 30000
            }

        ]), 2500);
    });
};

export async function makePurchase(userName, itemId, amount, total, perUnit) {
    return new Promise((resolve, reject) => {
        const mutation = `mutation {buyItems(userName: "Elandura-Silvermoon", itemId: ${itemId},amount: ${amount}, total: ${total}, perUnit: ${perUnit}) {money, amount, itemId ,price}}`;
        axios.post("http://localhost:4000/", {"query": mutation, operationName: null, variables: {}}).then(response => {
            console.log(response.data.data.buyItems)
            resolve(response.data.data.buyItems);
        })
    })
}

export async function downloadAverageItemPrice(itemId, amount) {
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
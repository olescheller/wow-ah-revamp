import axios from 'axios'

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


export async function downloadItemsSupplyByPartialName(partialName) {

    return new Promise((resolve, reject) => {
        const qry = `{items_supply(partialItemName: \"${partialName}\") { item {id name icon}, min_price quantity}}`;
        axios.post("http://localhost:4000/", {"query": qry}).then(response => {

            resolve(response.data.data.items_supply.filter(item => item!==null))
        })
    })
}
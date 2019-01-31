export const dummyApiCall = (id) => {
    return new Promise((resolve, reject) => {
        setTimeout(()=>resolve([
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
                    "icon": "inv_fabric_linen_01",
                    "id": "2589",
                    "name": "Linen Cloth"
                },
                "quantity": 7331,
                "min_price": 0
            }
        ]), 2500);
    });
};
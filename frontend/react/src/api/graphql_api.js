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
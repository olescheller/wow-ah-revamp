/**
 * get a user by its name and realm
 * @param db
 * @param name
 * @param realm
 * @returns {Promise}
 */
function getUserByNameAndRealm(db, name, realm) {
    return new Promise((resolve, reject) => {
        const Users = db.collection('users');
        Users.findOne({name: `${name}-${realm}`},
            (err, user) => {
                if (err) reject(err);
                resolve(user)
            });
    });
}

/**
 * get an item object by its id
 * @param converter
 * @param db
 * @param itemId
 * @returns {Promise}
 */
function getItemById(converter, db, itemId) {
    return new Promise((resolve, reject) => {
        const Items = db.collection('items');

        // DB CALL
        Items.findOne({id: itemId},
             (err, item) => {
                if (err) reject(err);
                if (item === null) resolve(null);
                const gqlItem = converter.ItemMongoToGql(item);
                resolve(gqlItem)
            }
        )
    });
}

/**
 * get an item object by its name
 * @param db
 * @param itemName
 * @returns {Promise}
 */
function getItemByName(db, itemName) {
    return new Promise((resolve, reject) => {
        const Items = db.collection('items');
        Items.findOne({name: itemName},
            async (err, item) => {
                if (err) reject(err);
                if (item === null) resolve(null);
                const itemClasses = await getItemClassById(db, item.item_class, item.item_sub_class);
                resolve({...item, ...itemClasses})
            }
        )
    });
}

function getItemNamesByPartialName(db, partialItemName, only_stackable = false) {
    return new Promise((resolve, reject) => {
        const Items = db.collection('items');
        const stackable = only_stackable ? {"is_stackable": true} : {};

        // DB CALL
        Items.find({'name': {'$regex': ".*" + partialItemName + ".*", '$options': 'i'}, ...stackable}).toArray(
             (err, items) => {
                if (err) reject(err);
                if (items.length === 0) resolve(null);
                let itemNames = [];
                for (let item of items){
                    itemNames.push(item.name)
                }
                resolve(itemNames);
            })
    });
}

function getItemsByPartialName(db, partialItemName) {
    return new Promise(async (resolve, reject) => {
        const items = await getItemNamesByPartialName(db, partialItemName);
        let gqlItems = [];
        for (let itemName of items) {
            const gqlItem = await getItemByName(db, itemName);
            gqlItems.push(gqlItem)
        }
        resolve(gqlItems);
    })
}

function getItemsSupplyByPartialName(db, partialItemName) {
    return new Promise(async (resolve, reject) => {
        const items = await getItemNamesByPartialName(db, partialItemName);
        let gqlItemsSupply = [];
        for (let itemName of items) {
            const gqlItemSupply = await getItemSupplyByName(db, itemName);
            gqlItemsSupply.push(gqlItemSupply)
        }
        resolve(gqlItemsSupply);
    })
}

/**
 * Get a class by its id
 * @param db: database object
 * @param classId: id of the class
 * @param subClassId: id of the subclass, retrieved from the item
 * @returns {Promise}
 */
function getItemClassById(db, classId, subClassId) {
    return new Promise((resolve, reject) => {
        const ItemClasses = db.collection('itemclasses');
        ItemClasses.findOne({id: classId},  (err, itemClass) => {
            if (err) reject(err);
            if (!itemClass) {
                resolve(null)
            }
            const itemSubClass = itemClass.subclasses.filter(i => i.id === subClassId)[0];
            if (!itemSubClass) {
                resolve(null)
            }
            let item_sub_class;

            const item_class = {name: itemClass.name, id: itemClass.id};
            if (itemSubClass) {
                item_sub_class = {name: itemSubClass.name, id: itemSubClass.id};
            }

            resolve({item_class, item_sub_class})
        });
    })
}

/**
 * Get the supply of a given item
 * @param db: database object
 * @param itemName: name of the item requested
 * @returns {Promise} item supply object
 */
function getItemSupplyByName(db, itemName) {
    return new Promise((resolve, reject) => {
        getItemByName(db, itemName).then((item) => {
            const SellOrders = db.collection('sellorders');
            SellOrders.find({item_id: item.id}).toArray((err, sellOrders) => {
                if (err) reject(err);
                if (sellOrders.length === 0) resolve(null);
                const quantity = sellOrders.reduce((acc, curr) => {
                    return acc + curr.quantity;
                }, 0);
                const prices = sellOrders.map(s => s.price);
                const min_price = Math.min(...prices);
                resolve({
                    id: item.id,
                    item: item,
                    quantity,
                    min_price
                })
            });
        });
    })
}


/// optimizations


function getItemsByPartialNameOPTIMIZED(converter, db, partialItemName, only_stackable = false, limit = 25) {
    return new Promise((resolve, reject) => {
        const Items = db.collection('items');
        const stackable = only_stackable ? {"is_stackable": true} : {};

        // DB CALL
        Items.find({'name': {'$regex': ".*" + partialItemName + ".*", '$options': 'i'}, ...stackable}).limit(limit).toArray(
             (err, items) => {
                if (err) reject(err);
                if (items.length === 0) resolve(null);
                let gqlItems = [];
                items.forEach( item => {
                    gqlItems.push(converter.ItemMongoToGql(item));
                });
                resolve(gqlItems);
            })
    });
}

function getItemsByPartialNameCount(converter, db, partialItemName, only_stackable = false) {
    return new Promise((resolve, reject) => {
        const SellOrders = db.collection('sellorders');
        const stackable = only_stackable ? {"is_stackable": true} : {};

            SellOrders.aggregate([
                { $match: {'item_name': {'$regex': ".*" + partialItemName + ".*", '$options': 'i'},  ...stackable}} ,
                { $group: { _id: "$item_name"}, },
                { $sort: {item_name: 1}}

                ]).toArray((err, items) => {
            resolve(items.length)

            })
    });
}


function getItemSuppliesByPartialNameOPTIMIZED(converter, db, partialItemName) {
    return new Promise((resolve, reject) => {

        // Get all items macthing the itemName
        getItemsByPartialNameOPTIMIZED(converter, db, partialItemName).then(items => {
            if (items === null) {
                resolve([]);
                return 0
            }

            // Get all sell orders and aggregate them to item supply for each item
            const SellOrders = db.collection('sellorders');
            SellOrders.find({
                'item_name': {
                    '$regex': ".*" + partialItemName + ".*",
                    '$options': 'i'
                }
            }).sort({item_name: -1}).toArray((err, mongoSellOrders) => {
                    // allSellOrder is a list of lists of SellOrders for each item
                    let allSellOrders = [];
                    let currentItemStarted = false;

                    for (let item of items) {
                        let sellOrdersOfItem = [];
                        for (let mongoSellOrder of mongoSellOrders) {
                            if (mongoSellOrder.item_name === item.name) {
                                currentItemStarted = true;
                                sellOrdersOfItem.push({...mongoSellOrder, item});

                            } else {
                                if (currentItemStarted) {
                                    currentItemStarted = false;
                                    break;
                                }
                            }
                        }
                        if (sellOrdersOfItem.length > 0) {
                            allSellOrders.push([...sellOrdersOfItem])
                        }
                    }

                    // Now go over all sell orders and aggregate each list
                    let listOfItemSupplies = [];

                    for (let sellOrderList of allSellOrders) {

                        const itemId = sellOrderList[0].item_id;
                        const item = sellOrderList[0].item;
                        const quantity = sellOrderList.reduce((acc, curr) => {
                            return acc + curr.quantity;
                        }, 0);
                        const prices = sellOrderList.map(s => s.price);
                        const min_price = Math.min(...prices);
                        listOfItemSupplies.push({
                            id: itemId,
                            item: item,
                            quantity,
                            min_price
                        })
                    }
                    resolve(listOfItemSupplies);
                }
            )
        });
    })
}

function getItemsPrice(db, itemId, amount) {
    return new Promise((resolve, reject) => {
        const SellOrders = db.collection('sellorders');
        SellOrders.find({item_id: itemId}).sort({price: 1}).toArray((err, sellOrders) => {
            console.log(sellOrders)
            if (err) reject(err);
            if (sellOrders.length === 0){
                resolve(null);
                return;
            }
            const quantity = sellOrders.reduce((acc, curr) => {
                return acc + curr.quantity;
            }, 0);
            console.log(amount, quantity)
            if(amount > quantity) {
                reject("The amount of item supplies does not match the amount requested")
            }
            else if(amount === 0) {
                resolve({perUnit: 0, total: 0});

            }
            else {
                let i = 0;
                let total = 0;
                let amountLeft = amount;
                while(amountLeft > 0 && i < sellOrders.length) {
                    console.log(`amount: ${amount}, amountLeft: ${amountLeft}`)
                    console.log(sellOrders[i])

                    if(sellOrders[i].quantity <= amountLeft) {
                        // Case buy whole sell order
                        total += sellOrders[i].price * sellOrders[i].quantity;
                        amountLeft = amountLeft - sellOrders[i].quantity;
                    }
                    else {
                        // Case buy parts of sell order
                        total += sellOrders[i].price * amountLeft;
                        amountLeft = 0;
                    }
                    i++;
                    console.log(total)
                }
                let perUnit =(total/amount);
                console.log({
                    perUnit,
                    total,
                })
                resolve({
                    perUnit,
                    total,
                });
            }
        });
    });
}

//
// getItemByName(db, itemName).then((item) => {
//     const SellOrders = db.collection('sellorders');
//     SellOrders.find({item_id: item.id}).toArray((err, sellOrders) => {
//         if (err) reject(err);
//         if (sellOrders.length === 0) resolve(null);
//         const quantity = sellOrders.reduce((acc, curr) => {
//             return acc + curr.quantity;
//         }, 0);
//         const prices = sellOrders.map(s => s.price);
//         const min_price = Math.min(...prices);
//         resolve({
//             id: item.id,
//             item: item,
//             quantity,
//             min_price
//         })
//     });
// });


module.exports = {
    getItemsByPartialName,
    getItemClassById,
    getItemById,
    getUserByNameAndRealm,
    getItemSupplyByName,
    getItemSuppliesByPartialNameOPTIMIZED,
    getItemsByPartialNameCount,
    getItemsPrice,
};
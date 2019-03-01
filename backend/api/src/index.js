const MongoToGqlConverter = require("./conversion");

const {GraphQLServer, withFilter, PubSub} = require('graphql-yoga');

const {
    createSellOrder,
    getItemsByPartialNameCount,
    getItemsByPartialName, getItemSuppliesByPartialNameOPTIMIZED,
    getItemClassById,
    getItemById,
    getUserByNameAndRealm,
    getItemSupplyByName,
    getItemsPrice,
    buyItems,
    getRandomItems,
    addItemsToSellOrder,
    removeSellOrder,
    getSellOrders,

} = require('./db');

const {MongoClient} = require('mongodb');
const MONGO_URL = 'mongodb://localhost:27017/';
const DB_NAME = 'wow_data';


const initGraphQL = async (db) => {

    const converter = new MongoToGqlConverter(db);
    await converter.init();

    // 1
    const typeDefs = `
type Query {
  item(id: Float!): Item
  items(partialItemName: String!): [Item]!
  item_class(id: Float!): ItemClass!
  item_supply(itemName: String!): ItemSupply
  items_supply(partialItemName: String!): [ItemSupply]
  items_count(partialItemName: String!): Int
  items_price(itemId: Float!, amount: Int!): Price
  user(name: String!, realm: String!): User
  randomItems: [InventoryItem]!
  sell_order(userName: String!, realmName: String!): [SellOrder]
}

type Mutation {
  createUser(name: String!): User!
  fakeBuyMutation: Price
  buyItems(userName: String!, itemId: Int, amount: Int!, total: Float!, perUnit: Float!): Receipt
  createSellOrder(itemId: Int!, seller_name: String!, seller_realm: String!, quantity: Int!, price: Float!): SellOrder!
  addItemToSellOrder(itemId: Int!, seller_name: String!, seller_realm: String!, quantity: Int!): SellOrder!
  removeSellOrder(itemId: Int!, seller_name: String!, seller_realm: String!): Boolean!
}

type Subscription {
  price: Price
  receipt(itemId: Int!): Receipt
  sellOrderAlert(sellerName: String!): [SellOrderAlert]
}

type SellOrderAlert {
    sellerName: String!
    buyerName: String!
    itemName: String!
    amount: Int!
    money: Float!
}

type InventoryItem {
    item: Item!
    quantity: Int!
}

type SellOrder {
    item: Item!
    price: Float!
    quantity: Int!
}

type Receipt {
  buyer: String
  item: Item!
  amount: Int
  amountBought: Int
  price: Int
  min_price: Float
  money: Float
}

type ItemSupply{
  id: Float!
  item: Item!
  quantity: Float!
  min_price: Float!
}

type Item {
  name: String!
  id: String!
  icon: String
  is_stackable: Boolean!
  item_class: ItemClass!
  item_sub_class: SubClass!
}

type ItemClass {
  id: Float!
  name: String
  subclasses: [SubClass]
}

type SubClass {
  id: Float!
  name: String
}

type Price {
  perUnit: Float!
  total: Float!
}

type User {
  name: String!
  money: Float!
}

`;


// 2
    const resolvers = {
        Query: {
            item: async (_, {id}) => {
                console.log({id})
                return await getItemById(converter, db, id);
            },
            item_class: async (_, {id}) => {
                return await getItemClassById(db, id)
            },
            item_supply: async (_, {itemName}) => {
                return await getItemSupplyByName(db, itemName);
            },
            items_supply: async (_, {partialItemName}) => {
                return await getItemSuppliesByPartialNameOPTIMIZED(converter, db, partialItemName);
            },
            items_count: async (_, {partialItemName}) => {
                return await getItemsByPartialNameCount(converter, db, partialItemName);
            },
            items: async (_, {partialItemName}) => {
                return await getItemsByPartialName(db, partialItemName);
            },
            items_price: async (_, {itemId, amount}) => {
                return await getItemsPrice(db, itemId, amount);
            },
            user: async (_, {name, realm}) => {
                return await getUserByNameAndRealm(db, name, realm)
            },
            randomItems: async () => {
                return await getRandomItems(converter, db)
            },
            sell_order: async (_, {userName, realmName}) => {
                return await getSellOrders(converter, db, userName, realmName)
            }
        },
        Mutation: {
            createUser: (_, {name}) => {
                const newUser = {
                    id: 34,
                    name: name
                };
                users = [...users, newUser];
                return newUser;
            },
            fakeBuyMutation: async () => {
                const price = {perUnit: 1, total: 1}
                pubsub.publish("PRICE_CHANGE", {price});
                return price;
            },
            buyItems: async (_, {userName, itemId, amount, total, perUnit}) => {
                //publish to pubsub
                const receipt = await buyItems(converter, db, userName, itemId, amount, total, perUnit);
                pubsub.publish("CHANGE_ITEM_SUPPLY_SUBSCRIPTION", {receipt});
                const sellOrderAlert = receipt.sold;
                console.log(sellOrderAlert)
                pubsub.publish('SELL_ORDER_SUBSCRIPTION', {sellOrderAlert});
                return receipt;
            },
            createSellOrder: async (_, {itemId, seller_name, seller_realm, quantity, price}) => {
                const sellOrder = await createSellOrder(converter, db, itemId, seller_name, seller_realm, quantity, price);
                const itemSupply = await getItemSupplyByName(db, sellOrder.item.name);
                const receipt = {item: sellOrder.item, amount: itemSupply.quantity , min_price: itemSupply.min_price}
                pubsub.publish('CHANGE_ITEM_SUPPLY_SUBSCRIPTION', {receipt});
                return sellOrder;
            },
            addItemToSellOrder: async (_, {itemId, seller_name, seller_realm, quantity}) => {
                return await addItemsToSellOrder(converter, db, itemId, seller_name, seller_realm, quantity)
            },
            removeSellOrder: async (_, {itemId, seller_name, seller_realm}) => {
                const removed = await removeSellOrder(converter, db, itemId, seller_name, seller_realm);
                const item = await getItemById(converter, db, itemId);
                const itemSupply = await getItemSupplyByName(db, item.name);
                const receipt = itemSupply ? {item: item, amount: itemSupply.quantity, min_price: itemSupply.min_price} : {item: item, amount: 0, min_price: null}
                pubsub.publish('CHANGE_ITEM_SUPPLY_SUBSCRIPTION', {receipt});
                return removed;
            }
        },

        Subscription: {
            price: {
                subscribe: (root, args, {pubsub}) => {
                    return pubsub.asyncIterator('PRICE_CHANGE')
                }
            },
            receipt: {
                subscribe: withFilter(() => {
                    return pubsub.asyncIterator('CHANGE_ITEM_SUPPLY_SUBSCRIPTION')
                }, (payload, variables) => {
                    return payload.receipt.item.id === variables.itemId;
                })
            },
            sellOrderAlert: {
                subscribe: withFilter(() => { return pubsub.asyncIterator('SELL_ORDER_SUBSCRIPTION')}, (payload, variables) => {
                    console.log({payload}, {variables})
                    const check = payload.sellOrderAlert.filter(alert => alert.sellerName === variables.sellerName);
                    console.log({check})
                    return check.length > 0;
                })
            }
        }
    };

    const pubsub = new PubSub();

    const server = new GraphQLServer({
        typeDefs,
        resolvers,
        context: {pubsub}
    });

    return server.start({
        cors: {
            "origin": "*",
            "methods": "GET,HEAD,PUT,PATCH,POST,DELETE",
            "preflightContinue": false,
            "optionsSuccessStatus": 204
        }
    });
};


const init = async () => {
    const mongoDB = await MongoClient.connect(MONGO_URL, {useNewUrlParser: true})
    if (mongoDB) {
        console.log('Successfully connected to db');
        const wowData = mongoDB.db(DB_NAME);
        await initGraphQL(wowData);
        console.log(`Server is running on http://localhost:4000`);
    }
};

init();
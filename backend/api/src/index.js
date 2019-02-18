
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
}

type Mutation {
  createUser(name: String!): User!
  fakeBuyMutation(itemId: Int!, total: Float!, perUnit: Float!): Price
  buyItems(userName: String!, itemId: Int, amount: Int!, total: Float!, perUnit: Float!): Receipt
  createSellOrder(itemId: Int!, seller_name: String!, seller_realm: String!, quantity: Int!, price: Float!): SellOrder!
  addItemToSellOrder(itemId: Int!, seller_name: String!, seller_realm: String!, quantity: Int!): SellOrder!
  removeSellOrder(itemId: Int!, seller_name: String!, seller_realm: String!): Boolean!
}

type Subscription {
  price(itemId: Int): Price
  receipt(itemId: Int): Receipt
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
  item: Item!
  amount: Int
  price: Int
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
            randomItems: async() => {
                return await getRandomItems(converter, db)
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
            fakeBuyMutation: async (_, {itemId, total, perUnit}) => {
                const price = {perUnit: perUnit + 1, total: total + 1}
                pubsub.publish("PRICE_CHANGE", {price});
                pubsub.publish("ITEM_QUANTITY_CHANGED", {price});
                return price;
            },
            buyItems: async (_, {userName, itemId, amount, total, perUnit}) => {
                //publish to pubsub
                const receipt = await buyItems(converter, db, userName, itemId, amount, total, perUnit);
                pubsub.publish("BUY_SUBSCRIPTION", {receipt});
                return receipt;
            },
            createSellOrder: async (_, {itemId, seller_name, seller_realm, quantity, price}) => {
                return await createSellOrder(converter, db, itemId, seller_name, seller_realm, quantity, price)
            },
            addItemToSellOrder: async(_, {itemId, seller_name, seller_realm, quantity}) => {
                return await addItemsToSellOrder(converter, db, itemId, seller_name, seller_realm, quantity)
            },
            removeSellOrder: async(_, {itemId, seller_name, seller_realm}) => {
                return await removeSellOrder(converter, db, itemId, seller_name, seller_realm);
            }
        },

        Subscription: {
            price: {
                subscribe: (root, args, {pubsub}) => {
                    return pubsub.asyncIterator('PRICE_CHANGE')
                }
            },
            receipt: {
                subscribe: withFilter(() =>  pubsub.asyncIterator('BUY_SUBSCRIPTION'), (payload, variables) => {
                    return payload.receipt.itemId === variables.itemId;
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
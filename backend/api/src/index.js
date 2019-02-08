const MongoToGqlConverter = require( "./conversion");

const {GraphQLServer, withFilter, PubSub} = require('graphql-yoga');

const {getItemsByPartialNameCount,
    getItemsByPartialName,getItemSuppliesByPartialNameOPTIMIZED,
    getItemClassById,
    getItemById,
    getUserByNameAndRealm,
    getItemSupplyByName,
    getItemsPrice} = require('./db');

const {MongoClient} = require('mongodb');
const MONGO_URL = 'mongodb://localhost:27017/';
const DB_NAME = 'wow_data';


const initGraphQL = async (db) => {

    const converter = new MongoToGqlConverter(db);
    await converter.init();

    // 1
    const typeDefs = `
type Query {
  item(id: Float): Item
  items(partialItemName: String): [Item]!
  item_class(id: Float): ItemClass!
  item_supply(itemName: String): ItemSupply
  items_supply(partialItemName: String): [ItemSupply]
  items_count(partialItemName: String): Int
  items_price(itemId: Float!, amount: Int!): Price
  user(name: String, realm: String): User
}

type Mutation {
  createUser(name: String!): User!
  fakeBuyMutation(itemId: Int, total: Float, perUnit: Float): Price
}

type Subscription {
price(itemId: Int): Price
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
            item_supply: async(_, {itemName}) => {
                return await getItemSupplyByName(db, itemName);
            },
            items_supply: async(_, {partialItemName}) => {
                return await getItemSuppliesByPartialNameOPTIMIZED(converter, db, partialItemName);
            },
            items_count: async(_, {partialItemName}) => {
                return await getItemsByPartialNameCount(converter, db, partialItemName);
            },
            items: async(_, {partialItemName}) => {
                 return await getItemsByPartialName(db, partialItemName);
            },
            items_price: async(_, {itemId, amount}) => {
                console.log({itemId, amount})
                return await getItemsPrice(db, itemId, amount);
            },
            user: async (_, {name, realm}) => {
                return await getUserByNameAndRealm(db, name, realm)
            },
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
                pubsub.publish("PRICE_CHANGE", {price})
                console.log(price)
                return price;
            }
        },

        Subscription: {
            price: {
                subscribe: (root, args, {pubsub}) => {
                    return pubsub.asyncIterator('PRICE_CHANGE')
                }
            },
        },
    };

// 3
    const pubsub = new PubSub();
    const server = new GraphQLServer({
        typeDefs,
        resolvers,
        context: { pubsub }
    });

    return server.start({cors: {
            "origin": "*",
            "methods": "GET,HEAD,PUT,PATCH,POST,DELETE",
            "preflightContinue": false,
            "optionsSuccessStatus": 204
        }});
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
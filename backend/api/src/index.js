const {GraphQLServer} = require('graphql-yoga')
const {getItemsByPartialName,
    getItemsSupplyByPartialName, getItemClassById, getItemById, getUserByNameAndRealm, getItemSupplyByName} = require('./db');
const {MongoClient} = require('mongodb');
const MONGO_URL = 'mongodb://localhost:27017/';
const DB_NAME = 'wow_data';


const initGraphQL = async (db) => {
    // 1
    const typeDefs = `
type Query {
  item(id: Int): Item
  items(partialItemName: String): [Item]!
  item_class(id: Int): ItemClass!
  item_supply(itemName: String): ItemSupply
  items_supply(partialItemName: String): [ItemSupply]
  user(name: String, realm: String): User
}

type Mutation {
  createUser(name: String!): User!
}

type ItemSupply{
  id: Int!
  item: Item!
  quantity: Int!
  min_price: Int!
}

type Item {
  name: String!
  id: String!
  icon: String!
  is_stackable: Boolean!
  item_class: ItemClass!
  item_sub_class: SubClass!
}

type ItemClass {
  id: Int!
  name: String
  subclasses: [SubClass]
}

type SubClass {
  id: Int!
  name: String
}

type User {
  name: String!
  money: Int!
}

`;

// 2
    const resolvers = {
        Query: {
            item: async (_, {id}) => {
                return await getItemById(db, id);
            },
            item_class: async (_, {id}) => {
                return await getItemClassById(db, id)
            },
            item_supply: async(_, {itemName}) => {
                return await getItemSupplyByName(db, itemName);
            },
            items_supply: async(_, {partialItemName}) => {
                return await getItemsSupplyByPartialName(db, partialItemName);
            },
            items: async(_, {partialItemName}) => {
                 return await getItemsByPartialName(db, partialItemName);
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
            }
        },
    };

// 3
    const server = new GraphQLServer({
        typeDefs,
        resolvers,
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
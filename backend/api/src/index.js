const {GraphQLServer} = require('graphql-yoga')
const {getItemClassById, getItemById} = require('./db');
const {MongoClient} = require('mongodb');
const MONGO_URL = 'mongodb://localhost:27017/';
const DB_NAME = 'wow_data';

let users = [
    {id: 1, name: "Jule"},
    {id: 2, name: "Ole"},
    {id: 3, name: "Ole"}
];


const initGraphQL = async (db) => {
    // 1
    const typeDefs = `
type Query {
  item(id: Int): Item
  item_class(id: Int): ItemClass!
  
  users(name: String): [User!]!
  user(id: Int): User
}

type Mutation {
  createUser(name: String!): User!
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
  id: Int!
  name: String!
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
            users: (_, {name}) => {
                if (name !== undefined)
                    return users.filter(i => (i.name === name));
                else
                    return users;
            },
            user: (_, {id}) => {
                return users.filter(i => (i.id === id))[0];
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

    return server.start();
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
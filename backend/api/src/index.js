const {GraphQLServer} = require('graphql-yoga')
const {MongoClient, Server, ObjectId} = require('mongodb');
const MONGO_URL = 'mongodb://localhost:27017/';
const DB_NAME = 'wow_data';

const idCreator = () => {
    let id = 3;

    function createId() {
        id++;
        return id;
    }

    return createId;
};
const newId = idCreator();
let users = [
    {id: 1, name: "Jule"},
    {id: 2, name: "Ole"},
    {id: 3, name: "Ole"}
];


function getItemById(db, itemId) {
    return new Promise((resolve, reject) => {
        const Items = db.collection('items');
        Items.findOne({id: itemId},
            async (err, item) => {
                if (err) reject(err);
                if (item === null) resolve(null);

                const itemClasses = await getItemClassById(db, item.item_class, item.item_sub_class);
                resolve({...item, ...itemClasses})
            }
        )
    });
}

function getItemClassById(db, classId, subClassId) {
    return new Promise((resolve, reject) => {
        const ItemClasses = db.collection('itemclasses');
        ItemClasses.findOne({id: classId}, async (err, itemClass) => {
            if (err) reject(err);


            const itemSubClass = itemClass.subclasses.filter(i => i.id === subClassId)[0];
            let item_sub_class;
            const item_class = {name: itemClass.name, id: itemClass.id};
            if (itemSubClass) {
                item_sub_class = {name: itemSubClass.name, id: itemSubClass.id};
            }

            resolve({item_class, item_sub_class})
        });
    })
}

const initGraphQL = async (db) => {
    // 1
    const typeDefs = `
type Query {
  item(id: Int): Item
  item_class(id: Int): ItemClass!
  
  users(name: String): [User!]!
  user(id: Int): User
  feed: [Link!]! 
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

type Link {
  id: Int!
  description: String!
  url: String!
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
            feed: () => [{id: 1, description: "asd", url: "qwe"}]
        },
        Mutation: {
            createUser: (_, {name}) => {
                const newUser = {
                    id: newId(),
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
    const mongoDB = await MongoClient.connect(MONGO_URL)
    if (mongoDB) {
        console.log('Successfully connected to db');
        const wowData = mongoDB.db(DB_NAME);
        await initGraphQL(wowData);
        console.log(`Server is running on http://localhost:4000`);
    }
};

init();
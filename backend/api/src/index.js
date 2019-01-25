const { GraphQLServer} = require('graphql-yoga')
const {MongoClient, Server, ObjectId} = require('mongodb');
const MONGO_URL = 'mongodb://localhost:27017/';
const DB_NAME = 'wow_data';

const idCreator = () => {
  let id = 3;
  function createId () {
    id ++;
    return id;
  }
  return createId;
};
const newId = idCreator();
let users = [
  {id: 1, name:"Jule"},
  {id:2 , name:"Ole"},
  {id:3 , name:"Ole"}
];

function getItems(db) {
  return new Promise((resolve, reject) => {
    const Items = db.collection('items');
    Items.find().toArray((err, items) =>{
      if (err) reject(err);
      items = items.map(async (item) => {
        const itemClass = await getItemClassById(db, item.item_class);
        console.log(itemClass)
        return {...item, item_class: itemClass}
      });
      resolve(items)
    });
  })
}


function getItemClassById(db, classId) {
  return new Promise((resolve, reject) => {
    const ItemClasses = db.collection('itemclasses');
    ItemClasses.findOne({class: classId}, (err, itemClass) =>{
      if (err) reject(err);
      resolve(itemClass)
    });
  })
}

const initGraphQL = async (db) => {
  // 1
  const typeDefs = `
type Query {
  items: [Item]
  item_class(id: Int): ItemClass
  info: String!
  users(name: String): [User!]!
  user(id: Int): User
  feed: [Link!]! 
}

type Mutation {
  createUser(name: String!): User!
}

type Item {
  name: String
  id: String
  icon: String
  is_stackable: Boolean
  item_class: ItemClass
  item_sub_class: Int
}

type ItemClass {
  class: Int
  name: String
  subclasses: [SubClass]
}

type SubClass {
  subclass: Int
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
      items: async () => {
        return await getItems(db);
      },
      item_class: async (_, {id}) => {
        return await getItemClassById(db, id)
      },
      info: () => `This is the API.`,
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
  if(mongoDB) {
    console.log('Successfully connected to db');
    const wowData = mongoDB.db(DB_NAME);
    await initGraphQL(wowData);
    console.log(`Server is running on http://localhost:4000`);
  }
};

init();
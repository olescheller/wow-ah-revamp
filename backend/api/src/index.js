const { GraphQLServer} = require('graphql-yoga');

const idCreator = () => {
    let id = 3;
    function createId () {
        id ++;
        return id;
    }
    return createId;
};
const newId = idCreator();
let users = [{id: 1, name:"Jule"}, {id:2 , name:"Ole"}];

// 1
const typeDefs = `
type Query {
  info: String!
  users: [User!]!
  user(id: Int): User
  feed: [Link!]!
}

type Mutation {
  createUser(name: String!): User!
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
        info: () => `This is the API of a Hackernews Clone`,
        users: () => users,
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
server.start(() => console.log(`Server is running on http://localhost:4000`));
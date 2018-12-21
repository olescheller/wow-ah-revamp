const { GraphQLServer } = require('graphql-yoga')

// 1
const typeDefs = `
type Query {
  info: String!
  users: [User!]!
  user(id: ID!): User
  feed: [Link!]!
}

type Mutation {
  createUser(name: String!): User!
}

type User {
  id: ID!
  name: String!
}

type Link {
  id: ID!
  description: String!
  url: String!
}
`;

// 2
const resolvers = {
    Query: {
        info: () => `This is the API of a Hackernews Clone`,
        users: () => [{id: 1, name:"Jule"}, {id:2 , name:"Ole"}],
        user: (id) => [{id: 1, name:"Jule"}, {id:2 , name:"Ole"}].filter(x => x.id === 1),
        feed: () => [{id: 1, description: "asd", url: "qwe"}]
    }
};

// 3
const server = new GraphQLServer({
    typeDefs,
    resolvers,
});
server.start(() => console.log(`Server is running on http://localhost:4000`))
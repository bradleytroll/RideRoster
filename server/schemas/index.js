const { GraphQLObjectType, GraphQLSchema } = require('graphql');
const { UserType, RideType, RootQuery, Mutation } = require('./types');

module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation: Mutation,
});

const { GraphQLObjectType, GraphQLString } = require('graphql')


const MovieType = new GraphQLObjectType({
  name: 'Movie',
  fields: () => ({
    id: { type: GraphQLString },
    name: { type: GraphQLString },
    genre: { type: GraphQLString },
  }),
});

exports.MovieType = MovieType
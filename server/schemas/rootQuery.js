const { GraphQLObjectType, GraphQLString, GraphQLSchema, GraphQLList, GraphQLInt, GraphQLNonNull } = require('graphql')
const authors = require('./authors.json')
const books = require('./books.json')
const { BookType, AuthorType } = require('./booksTypes')
const MovieType = require('./moviesTypes')


const RootQueryType = new GraphQLObjectType({
  name: 'Query',
  description: 'Root Query',
   fields: () => ({
    author: {
      type: AuthorType,
      description: 'A Single Author',
      args: {
        id: { type: GraphQLInt }
      },
      resolve: (parent, args) => authors.find(author => author.id === args.id)
    },
    book: {
      type: BookType,
      description: 'A Single Book',
      args: {
        id: { type: GraphQLInt }
      },
      resolve: (parent, args) => books.find(book => book.id === args.id)
    },
    books: {
      type: new GraphQLList(BookType),
      description: 'List of All Books',
      resolve: () => books
    },
    authors: {
      type: new GraphQLList(AuthorType),
      description: 'List of All Authors',
      resolve: () => authors
    },
    movie: {
      type: MovieType,
      args: { id: { type: GraphQLString }},
      resolve(parent, args){

      },
    }
   })
 })

 module.exports = RootQueryType

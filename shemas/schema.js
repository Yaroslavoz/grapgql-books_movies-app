const { GraphQLObjectType, GraphQLString, GraphQLSchema, GraphQLList, GraphQLInt, GraphQLNonNull } = require('graphql')
const authors = require('./authors.json')
const books = require('./books.json')

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

const RootMutationType = new GraphQLObjectType({
  name: 'Mutation',
  description: 'Root Mutation',
  fields: () => ({
    addBook: {
      type: BookType,
      description: 'Add a book',
      args: {
        name: { type: GraphQLNonNull(GraphQLString) },
        authorId: { type: GraphQLNonNull(GraphQLInt) }
      },
      resolve: (parent, args) => {
        const book = { id: books.length + 1, name: args.name, authorId: args.authorId }
        books.push(book)
        return book
      }
    },
    addAuthor: {
      type: AuthorType,
      description: 'Add an Author',
      args: {
        name: { type: GraphQLNonNull(GraphQLString) }
      },
      resolve: (parent, args) => {
        const author = { id: authors.length + 1, name: args.name }
        authors.push(author)
        return author
      }      
    }
  })
})

const BookType = new GraphQLObjectType({
  name: 'Book',
  description: 'This represents a book written by an author',
  fields: () => ({
    id: { type: GraphQLNonNull(GraphQLInt) },
    name: { type: GraphQLNonNull(GraphQLString)},
    authorId: { type: GraphQLNonNull(GraphQLInt) },
    author: {
      type: AuthorType,
      resolve: (book) => {
        return authors.find(author => author.id === book.authorId)
      }
    }
  })
})

const AuthorType = new GraphQLObjectType({
  name: 'Author',
  description: 'This represents an author of a book',
  fields: () => ({
    id: { type: GraphQLNonNull(GraphQLInt) },
    name: { type: GraphQLNonNull(GraphQLString)},
    books: {
      type: new GraphQLList(BookType),
      resolve: (author) => {
        return books.filter(book => book.authorId === author.id)
      }
    }
  })
})

const MovieType = new GraphQLObjectType({
  name: 'Movie',
  fields: () => ({
    id: { type: GraphQLString },
    name: { type: GraphQLString },
    genre: { type: GraphQLString },
  }),
});

 const schema = new GraphQLSchema({
  query: RootQueryType,
  mutation: RootMutationType    
 })

 module.exports = schema
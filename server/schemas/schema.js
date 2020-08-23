const { GraphQLObjectType, GraphQLString, GraphQLSchema, GraphQLList, GraphQLInt, GraphQLNonNull, GraphQLID, GraphQLScalarType } =require('graphql')
const authors = require('./localdata/authors.json')
const books = require('./localdata/books.json')
const Movies = require('./models/movie')
const Directors = require('./models/director')



// const {RootQueryType} = require('./rootQuery')
// const {RootMutationType} = require('./rootMutation')
// const { BookType, AuthorType } = require('./booksTypes')
// const{ MovieType } = require('./moviesTypes')

const RootQueryType = new GraphQLObjectType({
    name: 'Query',
    description: 'Root Query',
     fields: () => ({
      author: {
        type: AuthorType,
        description: 'A Single Author',
        args: {
          id: { type: GraphQLID }
        },
        resolve: (parent, args) => authors.find(author => author.id == args.id)
      },
      book: {
        type: BookType,
        description: 'A Single Book',
        args: {
          id: { type: GraphQLID }
        },
        resolve: (parent, args) => books.find(book => book.id == args.id)
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
      director: {
        type: DirectorType,
        args: {
          id: { type: GraphQLID }
        },
        resolve: (parent, args) => Directors.findById(args.id)
      },
      movie: {
        type: MovieType,
        args: {
          id: { type: GraphQLID }
        },
        resolve: (parent, args) => Movies.findById(args.id)
      },
      movies: {
        type: new GraphQLList(MovieType),
        description: 'List of All Movies',
        resolve: () => Movies.find({})
      },
      directors: {
        type: new GraphQLList(DirectorType),
        description: 'List of all directors',
        resolve: () => Directors.find({})
      }
      
     })
   })

const RootMutationType = new GraphQLObjectType({
  name: 'Mutation',
  description: 'Root Mutation',
  fields: () => ({
    addDirector: {
      type: DirectorType,
      description: 'Add a director',
      args: {
        name: { type: GraphQLNonNull(GraphQLString) },
        age: { type: GraphQLNonNull(GraphQLInt) }
      },
      resolve: (parent, args) => {
        const director = new Directors({
          name: args.name,
          age: args.age
        })
        return director.save()
      }
    },
    addMovie: {
      type: MovieType,
      description: 'Add a movie',
      args: {
        name: { type: GraphQLNonNull(GraphQLString) },
        genre: { type: GraphQLNonNull(GraphQLString) },
        directorId: { type: GraphQLNonNull(GraphQLID) }
      },
      resolve: (parent, args) => {
        const movie = new Movies({
          name: args.name,
          genre: args.genre,
          directorId: args.directorId
        })
        return movie.save()
      }
    }, 
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
        const author = { id: author.length + 1, name: args.name }
        authors.push(author)
        return author
      }      
    },
    deleteDirector: {
      type: DirectorType,
      description: 'Remove the movie',
      args: { id: { type: GraphQLNonNull(GraphQLID) } },
      resolve: (parent, args) => {
        return Directors.findByIdAndRemove(args.id)
      }
    },
    deleteMovie: {
      type: MovieType,
      description: 'Remove the film',
      args: { id: { type: GraphQLNonNull(GraphQLID) } },
      resolve: (parent, args) => {
        return Movies.findByIdAndRemove(args.id)
      }
    },
    //https://www.miramax.com/media/assets/Pulp-Fiction1.png
    //https://i.insider.com/57867bdf4321f1480f8b7e21?width=600&format=jpeg&auto=webp
    updateDirector: {
      type: DirectorType,
      args: {
        id: { type: GraphQLNonNull(GraphQLID) },
        name: { type: GraphQLNonNull(GraphQLString) },
        age: { type: GraphQLNonNull(GraphQLInt) },
        // img: { type: GraphQLNonNull(GraphQLString) }
      },
      resolve: (parent, args) => {
        return Directors.findByIdAndUpdate(
          args.id,
          { $set: { name: args.name, age: args.age } },
          { new: true }
        )
      }
    }
  })
})

const BookType = new GraphQLObjectType({
  name: 'Book',
  description: 'This represents a book written by an author',
  fields: () => ({
    id: { type: GraphQLNonNull(GraphQLID) },
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
    id: { type: GraphQLNonNull(GraphQLID) },
    name: { type: GraphQLNonNull(GraphQLString)},
    books: {
      type: new GraphQLList(BookType),
      resolve: (author) => {
        return books.filter(book => book.authorId === author.id)
      }
    }
  })
})


//================ movies part =============

const MovieType = new GraphQLObjectType({
  name: 'Movie',
  fields: () => ({
    id: { type: GraphQLNonNull(GraphQLID) },
    name: { type: GraphQLNonNull(GraphQLString) },
    genre: { type: GraphQLNonNull(GraphQLString) },
    directorId: {type: GraphQLNonNull(GraphQLInt)},
    director: {
      type: DirectorType,
      resolve: (movie) =>  {
        // return directors.find(director => director.id === movie.directorId )
       return Directors.findById(movie.directorId)
      }
    }
  }),
});

const DirectorType = new GraphQLObjectType({
  name: 'Director',
  fields: () => ({
    id: { type: GraphQLNonNull(GraphQLID) },
    name: { type: GraphQLNonNull(GraphQLString) },
    age: { type: GraphQLNonNull(GraphQLInt) },
    movies: {
      type: new GraphQLList(MovieType),
      resolve: (director) => {
        //return _filter(movie => movie.directorId == director.id)
        return Movies.find({ directorId: director.id })
      }
    }
  }),
});


module.exports = new GraphQLSchema({
  query: RootQueryType,
  mutation: RootMutationType    
 })



  
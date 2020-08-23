const express = require('express')
const { graphqlHTTP } = require('express-graphql')
const app = express()
const schema = require('./shemas/schema')
// const { GraphQLObjectType, GraphQLString, GraphQLSchema } = require('graphql')
//  const schema = new GraphQLSchema({
//    query: new GraphQLObjectType({
//      name: 'Hello_World',
//      fields: () => ({
//        message: { 
//          type: GraphQLString,
//          resolve: () => 'Hello World'
//         }
//      })
//    })
//  })


app.use('/graphql', graphqlHTTP({
  schema: schema,
  graphiql: true
}))

app.listen(5000., () => console.log('Server is running'))

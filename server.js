const express = require('express')
const { graphqlHTTP } = require('express-graphql')
const app = express()
const schema = require('./shemas/schema')
const mongoose = require('mongoose')

mongoose.connect('mongodb+srv://App_user:UZhrteAH8OzX7p8r@cluster0.3plfo.azure.mongodb.net/graphql-demo-app?retryWrites=true&w=majority', { useNewUrlParser: true, useUnifiedTopology: true})

const dbConnection = mongoose.connection
dbConnection.on('error', err => console.log(`Connection error: ${err}`))
dbConnection.once('open', ()=> console.log('Connected to DB!'))

app.use('/graphql', graphqlHTTP({
  schema: schema,
  graphiql: true
}))



app.listen(5000., () => console.log(`Server is running. Schema: ${!!schema}`))

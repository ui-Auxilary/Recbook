const express = require("express");
const {ApolloServer, gql} = require('apollo-server-express');
const jwt = require('jsonwebtoken');

// Create an express server
require('dotenv').config();

// - @IMPORTS
const mongo = require('./mongo');
const models = require('./models');

const port = process.env.port || 4000;
DB_HOST = process.env.DB_HOST;

mongo.connect(DB_HOST);

const books = [
        { id: '1', title: 'Harry Potter', author: 'J.K Rowling', genres: ['ad', 'asdasd'], description: 'Very cool book', rating: 4},
        { id: '2', title: 'James and the giant peach', author: 'Rohl Dahl', genres: ['pee', 'poo'], description: 'Not very cool book', rating: 3} 
]
// GraphQL Type definitions
const typeDefs = require('./schema');

// Resolvers 
const resolvers = require('./resolvers');

const helmet = require('helmet');
const cors = require('cors');

// MIDDLEWARE
const app = express();

app.use(helmet());
app.use(cors());

// get the user info from a JWT
const getUser = token => {
    if (token) {
        try {
            // return the user information from the token
            return jwt.verify(token, process.env.JWT_SECRET);
        } catch (err) {
            // if there's a problem with the token, throw an error
            throw new Error('Session invalid');
        }
    }
};


const server = new ApolloServer({ 
    typeDefs, 
    resolvers,
    context: ({req}) => {
        const token = req.headers.authorization;

        // Retrieve user data
        const user = getUser(token);

        return { models, user };
    }
});



// Apply the Apollo GraphQL middleware and set the path to /api
server.applyMiddleware({ app, path: '/api' });


// Response from server
app.listen({port}, () => console.log(`GraphQL server running on ${port} @ ${server.graphqlPath}`));

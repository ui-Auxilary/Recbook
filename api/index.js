const express = require("express");
const {ApolloServer, gql} = require('apollo-server-express');

// Create an express server
require('dotenv').config();

// - @IMPORTS
const mongo = require('./mongo');
const models = require('./models');

const port = process.env.port || 4000;
DB_HOST = process.env.DB_HOST;

mongo.connect();

const books = [
        { id: '1', title: 'Harry Potter', author: 'J.K Rowling', genres: ['ad', 'asdasd'], description: 'Very cool book', rating: 4},
        { id: '2', title: 'James and the giant peach', author: 'Rohl Dahl', genres: ['pee', 'poo'], description: 'Not very cool book', rating: 3} 
]
// GraphQL Type definitions
const typeDefs = gql`
    type Query {
            books: [Book!]!
            book(id: ID): Book!
    }

    type Book {
        id: ID!
        title: String!
        author: String!
        genres: [String]
        description: String
        rating: Int
    }

    type Mutation {
            newBook(title: String!, author: String!, genres: [String!]!, description: String, rating: Int): Book!
    }
`;

// Resolvers 
const resolvers = {
	Query: {
        books: async () => {
            return await models.Book.find();
        }, 
        book: (parent, args) => {
            return await models.Book.findById(args.id);
        }
    },
    Mutation: {
        newBook: async (parent, args) => {
            return await models.Book.create({
                id: String(books.length + 1),
                title: args.title,
                author: args.author,
                genres: args.genres,
                description: args.description,
                rating: args.rating
            })
        }  
    }
};

// MIDDLEWARE
const app = express();

const server = new ApolloServer({ typeDefs, resolvers });

// Apply the Apollo GraphQL middleware and set the path to /api
server.applyMiddleware({ app, path: '/api' });


// Response from server
app.listen({port}, () => console.log(`GraphQL server running on ${port} @ ${server.graphqlPath}`));

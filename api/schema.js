const {gql} = require('apollo-server-express');

module.exports = gql`
	scalar DateTime

	type Query {
		books: [Book!]!
		book(id: ID): Book!
		user(username: String!): User
		users: [User!]!
		me: User!
                bookFeed(cursor: String): BookFeed
	}

	type User {
		id: ID!
		username: String!
		email: String!
		recommends: [Book!]
		avatar: String
	}

	type Book {
		id: ID!
		title: String!
		author: String!
		genres: [String]
		description: String
		rating: Int
		uploadedBy: User!
		recommendCount: Int!
		recommendBy: [User!]
		createdAt: DateTime
		updatedAt: DateTime
	}

	type Mutation {
		newBook(
			title: String!
			author: String!
			genres: [String!]!
			description: String
			rating: Int
		): Book!
		deleteBook(id: ID!): Boolean!
		updateBook(
			id: ID!
			title: String
			author: String
			genres: [String]
			description: String
			rating: Int
		): Book!
		signUp(
			username: String!
			email: String!
			password: String!
		): String!
		signIn(
			username: String!
			email: String!
			password: String!
		): String!
		toggleRecommend(id: ID!): Book!
	}

        type BookFeed {
                books: [Book]!
                cursor: String!
                hasNextPage: Boolean!
        }
`;
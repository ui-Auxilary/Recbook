const Mutation = require('./mutation');
const Query = require('./query');
const User = require('./user');
const Book = require('./book');
const { GraphQLDateTime } = require('graphql-iso-date')

// import the modules at the top of the file
const depthLimit = require('graphql-depth-limit');
const { createComplexityLimitRule } = require('graphql-validation-complexity');
// update our ApolloServer code to include validationRules
const server = new ApolloServer({
	typeDefs,
	resolvers,
	validationRules: [depthLimit(5), createComplexityLimitRule(1000)],
	context: async ({ req }) => {
		// get the user token from the headers
		const token = req.headers.authorization;
		// try to retrieve a user with the token
		const user = await getUser(token);
		// add the db models and the user to the context
		return { models, user };
	}
});



module.exports = {
        Mutation,
        Query,
        Book,
        User,
        DateTime: GraphQLDateTime
};


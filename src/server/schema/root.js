const { GraphQLString, GraphQLObjectType, GraphQLSchema, GraphQLList } = require('graphql');

// INCLUDE FOR SALESFORCE CONNECTION
// const jsforce = require('jsforce');
// require('dotenv').config();
// const { LOGIN_URL, CLIENT_KEY, CLIENT_SECRET, REDIRECT_URL } = process.env;

// INCLUDE FOR REST CLIENT CALLS
// const axios = require('axios').default;
// const SERVER_URL = 'http://localhost:3001';

const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    description: 'Root Mother of all queries',
    fields: {
        // calls query methods
        hello: {
            type: GraphQLString,
            args: {
                message: { type: GraphQLString }
            },
            async resolve(
                parentValue, args, context
            ) {
                return args.message;
            }
        },
    }
});

module.exports = new GraphQLSchema({
    query: RootQuery
});
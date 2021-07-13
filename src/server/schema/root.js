/* eslint-disable no-unused-vars */
const { GraphQLString, GraphQLObjectType, GraphQLSchema, GraphQLList } = require('graphql');
const { CommandResponseSchema } = require('./models/genericResponse');
// INCLUDE FOR SALESFORCE CONNECTION
// const jsforce = require('jsforce');
// require('dotenv').config();
// const { LOGIN_URL, CLIENT_KEY, CLIENT_SECRET, REDIRECT_URL } = process.env;

// INCLUDE FOR REST CLIENT CALLS
const axios = require('axios').default;
const SERVER_URL = 'http://localhost:3001';

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
        getSfdxCommands: {
            type: CommandResponseSchema,
            args: {
                command: { type: GraphQLString },
                flags: { type: new GraphQLList(GraphQLString) }
            },
            async resolve(
                parentValue, { command, flags }, context
            ) {
                let response = [];
                const sfdxCommandEndpoint = `${SERVER_URL}/api/v1/sfdx/${command}?${flags.join('&')}`;
                console.log(`endpoint : ${sfdxCommandEndpoint}`);
                try {
                    response = await axios.get(sfdxCommandEndpoint);
                }
                catch (err) {
                    return console.log(err);
                }
                return {
                    total: response.data.length ? response.data.length :0,
                    commands: [...response.data]
                }
            }
        },
    }
});

module.exports = new GraphQLSchema({
    query: RootQuery
});
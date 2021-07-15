/* eslint-disable no-unused-vars */
const { GraphQLString, GraphQLObjectType, GraphQLSchema, GraphQLList } = require('graphql');
// SCHEMA MODELS
const { CommandResponseSchema } = require('./models/commandModel');
const { SalesforceAuthResponse, LoginInputObject } = require('./models/authModel');

// INCLUDE FOR SALESFORCE CONNECTION
const { login } = require('./utils/force');

// INCLUDE FOR REST CLIENT CALLS
const axios = require('axios').default;
const SERVER_URL = 'http://localhost:3001';

const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    description: 'Root Mother of all queries',
    fields: {
        // sample calls
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
        sfdxCommands: {
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
                } catch (err) {
                    return console.log(err);
                }
                return {
                    total: response.data.length ? response.data.length : 0,
                    commands: [...response.data]
                }
            }
        },
        orgLogin: {
            type: SalesforceAuthResponse,
            args: {
                creds: { type: LoginInputObject }
            },
            async resolve(parentValue, { creds }) {
                const { username, password, securityToken, instanceUrl } = creds;
                console.log('logging in as : ' + username);
                let results = {};
                try {
                    // Direct login to salesforce
                    results = await login(username, password + securityToken, instanceUrl);

                } catch (error) {
                    console.error(error);
                }
                return results;
            }
        },
    }
});

module.exports = new GraphQLSchema({
    query: RootQuery
});
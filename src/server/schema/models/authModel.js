/* eslint-disable no-unused-vars */
const { GraphQLID, GraphQLString, GraphQLBoolean, GraphQLObjectType, GraphQLInputObjectType } = require('graphql');
const { getRecord, query } = require('../utils/force');


// Authentication Input Details
const LoginInputObject = new GraphQLInputObjectType({
    name: 'LoginInput',
    description: 'User Login Details',
    fields: () => ({
        username: { type: GraphQLString },
        password: { type: GraphQLString },
        securityToken: { type: GraphQLString },
        instanceUrl: { type: GraphQLString }
    })
});
// Schema for the User SObject
const SalesforceUserObject = new GraphQLObjectType({
    name: 'UserSObject',
    description: 'User Object Details',
    fields: () => ({
        id: { type: GraphQLID },
        display_name: { type: GraphQLString },
        active: { type: GraphQLBoolean },
        user_type: { type: GraphQLString },
        language: { type: GraphQLString },
        locale: { type: GraphQLString },
        last_modified_date: { type: GraphQLString }
    })
});

// Schema for the Login Authentication and other sequential calls information
const SalesforceAuthResponse = new GraphQLObjectType({
    name: 'AuthResponse',
    description: 'Authentication Details',
    fields: () => ({
        accessToken: { type: GraphQLString },
        instanceUrl: { type: GraphQLString },
        userId: { type: GraphQLString },
        organizationId: { type: GraphQLString },
        loggedInDate: {
            type: GraphQLString,
            async resolve(parentValue, args, context) {
                return new Date().toLocaleString();
            },
        },
        currentUser: {
            type: SalesforceUserObject,
            async resolve(parentValue, args, context) {
                const org = {
                    instanceUrl: parentValue.instanceUrl,
                    accessToken: parentValue.accessToken
                };

                // OPTIONS:

                // QUERY
                // const soql = `SELECT Id, Name FROM User WHERE Id=${parentValue.userId}`;
                // const response = await query(org, soql);

                // GET RECORD
                const response = await getRecord(org, 'User', parentValue.userId);
                return response;
            },
        },

    })
});

module.exports = { SalesforceAuthResponse, LoginInputObject };
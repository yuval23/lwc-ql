// eslint-disable-next-line no-unused-vars
const { GraphQLObjectType, GraphQLInt, GraphQLString, GraphQLList, GraphQLID } = require('graphql');

const SfdxCommand = new GraphQLObjectType({
    name: 'SfdxCommand',
    description: 'SFDX COMMAND HELP',
    fields: () => ({
        id: { type: GraphQLString },
        pluginType: { type: GraphQLString },
        description: { type: GraphQLString }
    })
});

const CommandResponseSchema = new GraphQLObjectType({
    name: 'CliCommandListResponse',
    description: 'SFDX RESPONSE',
    fields: () => ({
        total: { type: GraphQLInt },
        commands: { type: new GraphQLList(SfdxCommand) }
    })
});


module.exports = { CommandResponseSchema };




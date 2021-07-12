const express = require('express');
const compression = require('compression');
const helmet = require('helmet');
const path = require('path');
const { graphqlHTTP } = require('express-graphql');

// GraphQL
const rootSchema = require('./schema/root');

const app = express();
app.use(helmet(), compression(), express.json());

const HOST = process.env.HOST || 'localhost';
const PORT = process.env.PORT || 5000;
const SERVER_URL = `http://${HOST}:${PORT}`;

// const DIST_DIR = './dist';
const DIST_DIR = './src/client';

// fetching the graphQl schema
app.use('/graphql', async(req, res) => {
    graphqlHTTP({
        schema: rootSchema,
        graphiql: true,
        context: req
    })(req, res);
});


app.use(express.static(DIST_DIR));

app.use('*', (req, res) => {
    res.sendFile(path.resolve(DIST_DIR, 'index.html'));
});


app.listen(PORT, () => console.log(`✅  API Server started: ${SERVER_URL}`));
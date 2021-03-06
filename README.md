# Using LWC OSS With GraphQL - Starter Kit

- https://lwc.dev - Lightning Web Components 
- https://graphql.org/ - Official GraphQL Guide

## Demo App 
- Includes Simple Message to GraphQL
- Execution of [SFDX CLI commands](https://developer.salesforce.com/tools/sfdxcli)
- Connection to Salesforce Api via [JSForce](https://jsforce.github.io/)
- It meant to provide a quick start for building apps *in and out* of Salesforce using LWC and GraphQL with data from Salesforce. 

## How to start?

- Clone this repository OR perform the below steps yourself
- `git clone https://github.com/vyuvalv/lwc-ql.git`
- Start with `npm install`
- Use our node scripts `npm run build` OR `npm run build:development` - To Copy SLDS folder into `./assets`
- Run `npm run watch`
- View on your port - by default `http://localhost:3001`
- Start Building Components or fetch more data to your app...
- Would be reccomended to create a *scratch org* to test the connection

</br>


### Final App Image


![Main Home Page Screen](https://github.com/vyuvalv/lwc-ql/blob/salesforce-connection/docs/screens/lwc-ql-intro.png)

</br>
</br>

# Steps to build your own Project
</br>

> Scafold your base LWC app structure

- `https://lwc.dev/`
- Run : `npx create-lwc-app my-app`

        - The command will create the basic structure and ask a few questions:
            * Do you want to use the simple setup? Yes
            * Standard Web App
            * Do you want a basic Express API server? Yes

        We will change a bit the files so only the base structure is wht we care about.
        Once its done intalling all dependencies go into your project.
    
Open in VS Code:
*   `code my-app`
</br> 

## Set up your Project

- Go to your - `package.json` file

    <details>
        <summary>  Install Dependencies Packages  </summary>
        </br>

    ## Install npm packages from your project

    * Breakdown of the dependencies below
    * `npm i ` - npm install :
        * `@salesforce-ux/design-system` - Salesforce lightning design system
        * `lightning-base-components` - the ui open source base components 
        * `@lwc/synthetic-shadow` - add the shaddow dom
        * `express-graphql graphql` - GraphQL with Express Server
        * `jsforce` - Connection to Salesforce
        * `axios` - Making Rest Calls easier
        * `dotenv`- Storing parameters used for the connection to Salesforce Connected App option

       ```json

        "dependencies": {
                "@lwc/synthetic-shadow": "^1.17.6",
                "@salesforce-ux/design-system": "^2.14.3",
                "lightning-base-components": "^1.11.5-alpha",
                "compression": "^1.7.4",
                "helmet": "^3.21.2",
                "express": "^4.17.1",
                "express-graphql": "^0.12.0",
                "graphql": "^15.5.1",
                "jsforce": "^1.10.1", 
                "axios": "^0.21.1",
                "dotenv": "^8.2.0"
            },
        ```
    </details>
    </br>

## Setting up the LWC services processes
- The LWC services configuration file - `lwc-services.config.js` 
    <details>
    <summary> Including SLDS Copy inside your project </summary>
    </br>

    1. We will use `lwc-services` to do the Following (It's like webpack configuration...):
        1. Transfer the SLDS assets folder into our Resources folder
        2. Build our `dist` public minified folder
    2. We can run it with our `package.json` npm scripts :
        *  `npm run build:development`
        *  `npm run build`

        ```js
            // Find the full example of all available configuration options at
            // https://github.com/muenzpraeger/create-lwc-app/blob/main/packages/lwc-services/example/lwc-services.config.js


            const buildFolder = './dist';
            const srcFolder = 'src/client';

            module.exports = {
                buildDir: `${buildFolder}`,
                sourceDir: `./${srcFolder}`,
                resources: [
                    { from: `${srcFolder}/resources/`, to: `${buildFolder}/resources/` },
                    {
                        from: 'node_modules/@salesforce-ux/design-system/assets',
                        to: `${srcFolder}/assets`
                    },
                    { from: `${srcFolder}/assets/`, to: `${buildFolder}/assets/` },
                ],
                devServer: {
                    proxy: { '/': 'http://localhost:5000' }
                }
            };
        ```
    
   
    </details>
    </br>
- Go to your configuration - `lwc.config.json` 
    <details>
    <summary> Add Lightning Base Components module </summary>
    </br>

    * `lwc.config.json` - will add the lightning base component location to the bundle
    * Powerful reusable base components to get started with UI build. 

        ```json
            {
                "modules": [{
                        "dir": "src/client/modules"
                    },
                    {
                        "npm": "lightning-base-components"
                    }
                ]
            }
        ```

    </details>
    </br>

## Include Lightning Base Components and Design System
- Inside your main - `index.js` 
    <details>
    <summary> Include Shaddow Dom and LWC App </summary>
    </br>

    * import the `synthetic-shadow` resource

    ```js
        import '@lwc/synthetic-shadow';
        import { createElement } from 'lwc';
        import MyApp from 'my/app';

        const app = createElement('my-app', { is: MyApp });
        // eslint-disable-next-line @lwc/lwc/no-document-query
        document.querySelector('#main').appendChild(app);
    ```
    </details>
    </br>
- Then on your main - `index.html` file    
    <details>
    <summary> Include SLDS as Design System</summary>
    </br>

    - Add the link to the css resources from main html file.
    - Change the path to your css assets resources folder:

    ```html
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <title>LWC With GraphQL App - By Yuval Vardi </title>
            <!-- meta -->
            <meta charset="utf-8" />
            <!-- Include SLDS as Styling Resource -->
            <link rel="stylesheet" type="text/css" href="./assets/styles/salesforce-lightning-design-system.min.css" />
            <!-- viewport -->
            <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
            <link rel="shortcut icon" href="./resources/favicon.ico" />
        </head>

        <body>
            <!-- Our Lightning Web Component Container App -->
            <div id="main"></div>
        </body>

        </html>
    ```
 
    </details>
    </br>

## Setting Up your Server

- We are using Express Server with GraphQL
    * The base setup comes with a file named  `/server/api.js` which we renamed to `/server/main.js`.
    * We also use `express-graphql` which helps us bridge between Express to GraphQL Schema.

    <details>
    <summary> Express Server File Configuration </summary>
    </br>

    * Now its where we starting to include GraphQL as our "integration framework"    
    * We will expose an endpoint that can receive the GraphQL Queries

    ```js
            const express = require('express');
            const compression = require('compression');
            const helmet = require('helmet');
            const path = require('path');
            const { graphqlHTTP } = require('express-graphql');

            const rootSchema = require('./schema/root');

            const app = express();
            app.use(helmet(), compression(), express.json());


            const HOST = process.env.HOST || 'localhost';
            const PORT = process.env.PORT || 5000;
            const SERVER_URL = `http://${HOST}:${PORT}`;

            // Toggle between DEV or PROD folder
            // const DIST_DIR = './dist';
            const DIST_DIR = './src/client';

            // GraphQL Endpoint for all callouts
            app.use('/graphql', async(req, res) => {
                graphqlHTTP({
                    schema: rootSchema,
                    graphiql: true,
                    context: req
                })(req, res);
            });

            // Use a static index folder as the only page rendered
            app.use(express.static(DIST_DIR));

            app.use('*', (req, res) => {
                res.sendFile(path.resolve(DIST_DIR, 'index.html'));
            });

            app.listen(PORT, () => console.log(`???  API Server started: ${SERVER_URL}`));

    ```
    </details>
    </br>

- GraphQL Schema Builder - `/server/schema/root.js`
    <details>
        <summary> Initial GraphQL Schema </summary>
        </br>

    ```js
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
    ```
    </details>
    </br> 

## Bring it all together on your client
- LWC Service Component - `/client/modules/data/services/services.js`
    <details>
        <summary> Expose a service for Client Rest callout to your GraphQL Server  </summary>
        </br>
    1. Exposing a services method that can be imported from any component using:
    
    * `import { getData } from '../../data/services/services';`

    2. Service to perform HTTP Post call request

        ```js
                    const graphEndpoint = '/graphql';

                    export async function getData(query) {
                        console.log('query ' + query.query);
                        try {
                            const response = await fetch(graphEndpoint, {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json',
                                    Accept: 'application/json'
                                },
                                body: JSON.stringify(query)
                            });
                            return response.json();
                        } catch (e) {
                            return e;
                        }
                    }
        ```
    </details>
    </br>

- LWC App - `/client/modules/my/app`
    <details>
    <summary> Setting your LWC App with a Button to call GraphQL  </summary>
    </br>

    * app.js

    ```js
        import { LightningElement, api } from 'lwc';
        import { getData } from '../../data/services/services';

        export default class App extends LightningElement {

            message = 'Whoo hooo!!';
            response = '';

            // button click
            handleClick() {
                // build basic graphQL query
                const baseQuery = {
                    query: `{
                        hello(message:"${this.message}")
                    }`
                };
                this.fetchData(baseQuery);
            }

            // input value on change
            handleInputChange(event) {
                this.message = event.target.value;
            }


            // get Data
            async fetchData(query) {
                try {
                    const response = await getData(query);
                    if (response.data) {
                        console.log('SUCCESS ' + JSON.stringify(response));
                        this.response = JSON.stringify(response);
                    }
                } catch (err) {
                    console.error(err);
                }
            }
        }

    ```
    * app.html

    ```html
        <template>

            <div class="slds-grid slds-wrap slds-grid_vertical slds-grid_vertical-align-center">
                <div class="slds-grid slds-wrap">
                    <!-- Message Input -->
                    <lightning-input name="messageInput" label="message" field-level-help="Whatever you send you will get back via GraphQL" 
                                     value={message} 
                                     onchange={handleInputChange}> </lightning-input>
                    <!-- Submit Button -->                
                    <lightning-button label="Call GraphQL" variant="brand" onclick={handleClick}></lightning-button>
                </div>
                <!-- Response -->     
                <lightning-textarea value={response} class="slds-size_1-of-1" disabled></lightning-textarea>
            </div>

        </template>

    ```

    </details>
    </br>

Start simple by running `yarn watch` (or `npm run watch`, if you set up the project with `npm`). 
This will start the project with a local development server.

* By default its `http://localhost:3001`.

</br>

## What's Next ?
</br>


### GraphQL Query - add a new Data Object

- Create a GraphQL Schema Object for your Response


```js
    const { GraphQLString, GraphQLObjectType, GraphQLID } = require('graphql');

    const ObjectResponseSchema = new GraphQLObjectType({
        name: 'ObjectName',
        description: 'Describe your object fields and query methods',
            fields: () => ({
                id: { type: GraphQLID },
                name: { type: GraphQLString }
            })
        });

```

- Add a master query method that build the Reuqest and return the Response object
- Inside your `root.js` we have our master root Query where we will add this ne method


```js
        
        const RootQuery = new GraphQLObjectType({
            name: 'RootQueryType',
            description: 'Root Mother of all queries',
            fields: {
                hello: {
                        type: ObjectResponseSchema,
                        args: {
                            name: { type: GraphQLString }
                        },
                        async resolve(
                            parentValue, args, context
                        ) {
                            return { 
                                id:'1',
                                name: args.name
                            };
                        }
                    },
                }
            });
```

* Use graphql interface to test your queries - `http://localhost:3001/graphql`
* Add your query call from your client LWC app

```js
   const graphQuery = { 
       query: `{ 
                hello( name:"${this.message}" ){ 
                        id 
                        name 
               } 
            }` 
        };
    // use our service module to call GraphQL
   const response = await getData(graphQuery);
```

### Add LWC Components

* To add new components simply create the component folder inside the modules folder
* We will add it into `./client/modules/c` folder in our modules to match the way Salesforce Project use it. 


> Component bundle will have the following structure

```html
 <template></template>
```

```js
import { LightningElement, api, track } from 'lwc';
export default class ComponentName extends LightningElement {}
```
> Calling your component from parent html

- use `folderName-component-name` 
```html
<c-component-name></c-component-name>
```


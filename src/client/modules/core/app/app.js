import { LightningElement, api, track } from 'lwc';
import { getData } from '../../data/services/services';
import { checkInputsValidity } from '../../utils/formUtils';

const LOGIN_INPUTS = ['username', 'instanceUrl', 'password', 'securityToken'];

export default class App extends LightningElement {
    @api
    get pathName() {
        return this._pathName;
    }
    set pathName(value) {
        this._pathName = `${value}`;
    }

    loading = false;
    activeTab = 'intro';
    activeCommand = 'commands';

    message = 'Whoo hooo!!';
    response = '';
    loginFields = LOGIN_INPUTS;

    // Intro input message
    handleInputChange(event) {
        this.message = event.target.value;
    }

    // Change Tab
    handleActiveTab(event) {
        this.activeTab = event.target.value;
        this.response = '';
    }

    // Run callout button 
    handleClick() {
        // Build query
        let graphQuery = { query: `{}` };
        let isValid = false;
        // Toggle Query builder based on active tab
        switch (this.activeTab) {
            case 'intro':
                // check message exists
                isValid = this.message.length > 1;
                graphQuery = { query: `{ hello(message:"${this.message}") }` };
                break;
            case 'sfdx':
                // Get child component details
                const { command, flags, valid } = this.template.querySelector('c-command').getOutputCommand();
                isValid = valid;
                // console.log('command ' + command);
                // console.log('flags ' + JSON.stringify(flags));  
                // this.activeCommand = command;
                graphQuery = this.generateSfdxCommand(command, flags);
                break;
            case 'login':
                // Get login input values 
                const orgDetails = this.getLoginDetails();
                isValid = orgDetails;
                graphQuery = this.generateLoginQuery(orgDetails);
                break;
        }

        if (isValid && graphQuery) {
            // Run Query
            this.loading = true;
            this.fetchData(graphQuery);
        }
    }

    // Call GraphQL Server
    async fetchData(query) {
        try {
            const response = await getData(query);
            if (response) {
                console.log('SUCCESS ' + JSON.stringify(response));
                this.loading = false;
                this.response = JSON.stringify(response);
            }

        } catch (err) {
            console.log('error : ' + JSON.stringify(err));
        }
    }

    // Build an SFDX Command
    generateSfdxCommand(command, flags) {
        return {
            query: `{
                sfdxCommands(
                    command:"${command}",
                    flags:${JSON.stringify(flags)}
                    ){
                        total
                        commands{ id description } 
                    }
            }`
        };
    }

    // This will pass the input values for the login using JS Force
    generateLoginQuery(orgDetails) {
        // Format for graphQL Query
        const orgCredentials = JSON.stringify(orgDetails).replace(/"([^"]+)":/g, '$1:');

        // const sample = `{ 
        //     username:"test-lm2urzytje72@example.com",
        //     password:"K7_J!tUEA[A7O",
        //     securityToken:"JULIUS_CCJR",
        //     instanceUrl:"https://rapid-innovation-5550-dev-ed.cs18.my.salesforce.com" 
        // }`;

        return {
            query: `{
                orgLogin( creds: ${orgCredentials} ){
                    userId
                    accessToken
                    loggedInDate
                    currentUser { display_name }
                }
            }`
        };
    }

    // Check and inform validy 
    // Build object from input values
    getLoginDetails() {
        const inputs = this.template.querySelectorAll('.login-input');
        const valid = checkInputsValidity(inputs);
        let loginValuesObject = {};

        if (valid) {
            inputs.forEach(el => {
                if (el.value) {
                    loginValuesObject[el.name] = el.value;
                }
            });
        }
        return valid ? loginValuesObject : valid;
    }
}
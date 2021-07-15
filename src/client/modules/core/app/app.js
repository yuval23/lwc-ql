import { LightningElement, api, track } from 'lwc';
import { getData } from '../../data/services/services';

const LOGIN_INPUTS = ['username', 'instanceUrl', 'password', 'securityToken'];
const DEFAULT_FLAGS = [{ name: 'json', type: 'boolean', disabled: true }, { name: 'username', type: 'text', disabled: false }];

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
    command = 'commands';

    message = 'Whoo hooo!!';

    response = '';
    loginFields = LOGIN_INPUTS;

    handleInputChange(event) {
        this.message = event.target.value;
    }
    handleActiveTab(event) {
        this.activeTab = event.target.value;
    }

    // Handle Flag items - add/remove/view
    @track _flags = DEFAULT_FLAGS;

    handleAddFlag() {
        this._flags.push({});
    }
    handleRemoveFlag(event) {
        const flagIndex = parseInt(event.target.dataset.index);
        if (flagIndex > 0) {
            console.log(flagIndex);
            this._flags.splice(flagIndex, 1);
        }
    }

    get flags() {
        return this._flags.map((item, index) => ({
            ...item,
            allowRemove: index > 0,
            requireValue: item.type !== 'boolean',
            index
        }));
    }

    // Run callout button 
    handleClick() {
        // Build query
        let graphQuery = { query: `{}` };
        switch (this.activeTab) {
            case 'intro':
                graphQuery = { query: `{ hello(message:"${this.message}") }` };
                break;
            case 'sfdx':
                graphQuery = this.generateSfdxCommand();
                break;
            case 'login':
                graphQuery = this.generateLoginQuery();
                break;
        }
        if (graphQuery) {
            // Run Query
            console.log('query: ' + graphQuery.query);
            this.loading = true;
            this.fetchData(graphQuery);
        }
    }

    // Build an SFDX Command
    generateSfdxCommand() {
        let flags = ['--json'];
        const flagInputs = this.template.querySelectorAll('.flag-input');
        // get flag input values
        if (flagInputs.length) {
            flagInputs.forEach(input => {
                this.flags.forEach(flag => {
                    if (flag.name === input.name) {
                        flags.push(`--${flag.name}=${input.value}`);
                    }
                })
            });
        }
        return {
            query: `{
                sfdxCommands(
                    command:"${this.command}",
                    flags:${JSON.stringify(flags)}
                    ){
                        total
                        commands{ id description } 
                    }
            }`
        };
    }

    // This will pass the input values for the login using JS Force
    generateLoginQuery() {
        const orgInputs = this.checkValidity();
        if (orgInputs) {
            // format for graphQL Query
            const orgCredentials = JSON.stringify(orgInputs).replace(/"([^"]+)":/g, '$1:');

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
        return;

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


    // Check and inform form validy 
    // Build object from input values
    checkValidity() {
        const inputs = this.template.querySelectorAll('.login-input');
        let loginValuesObject = {};
        const valid = [...inputs].reduce((validSoFar, inputField) => {
            inputField.reportValidity();
            return validSoFar && inputField.checkValidity();
        }, true);
        if (valid) {
            inputs.forEach(el => {
                if (el.value) {
                    loginValuesObject[el.name] = el.value;
                }
            });
        }
        return valid ? loginValuesObject : false;
    }
}
import { LightningElement, api, track } from 'lwc';
import { getData } from '../../data/services/services';

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
    @track response = '';

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
        // Toggle Query builder based on active tab
        // eslint-disable-next-line default-case
        switch (this.activeTab) {
            case 'intro':
                // check message exists
                graphQuery =  this.message.length > 1 ? { query: `{ hello(message:"${this.message}") }` }: false;
                break;
            case 'sfdx':
                 // command component
                graphQuery = this.getSfdxCommand();
                break;
            case 'login':
                // fetch login details 
                graphQuery = this.getLoginQuery();
                break;
        }

        if (graphQuery) {
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

    // This will build an SFDX Command - Currently Response Schema only supports commands --json
    getSfdxCommand() {
        // Get child component details
        const { command, flags, valid } = this.template.querySelector('c-command').getOutputCommand();
        // console.log('command ' + command);
        // console.log('flags ' + JSON.stringify(flags));  
        // this.activeCommand = command;
        return valid ? {
            query: `{
                sfdxCommands(
                    command:"${command}",
                    flags:${JSON.stringify(flags)}
                    ){
                        total
                        commands{ id description } 
                    }
            }`
        }: valid;
    }

    // This will pass the credentials arguments to login using JS Force
    getLoginQuery() {
        // Get login inputs values 
        const { formInputs, valid } = this.template.querySelector('c-credentials').getFormInputs();

            // const sample = `{ 
            //     username:"test-dx-user@example.com",
            //     password:"CAPTAIN_AMERICA",
            //     securityToken:"KING_JULIUS_JR",
            //     instanceUrl:"https://rapid-innovation-8888-dev-ed.cs18.my.salesforce.com" 
            // }`;
        
            // Format for graphQL Query
            return valid ? {
                query: `{
                    orgLogin( creds: ${JSON.stringify(formInputs).replace(/"([^"]+)":/g, '$1:')} ){
                        userId
                        accessToken
                        loggedInDate
                        currentUser { display_name }
                    }
                }`
            }: valid;
    }

}
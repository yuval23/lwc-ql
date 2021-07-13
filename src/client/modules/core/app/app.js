import { LightningElement, api } from 'lwc';
import { getData } from '../../data/services/services';

export default class App extends LightningElement {
    @api
    get pathName() {
        return this._pathName;
    }
    set pathName(value) {
        this._pathName = `${value}`;
    }

    message = 'Whoo hooo!!';
    response = '';

    handleInputChange(event) {
        this.message = event.target.value;
    }

    handleClick() {
        // build query
        const baseQuery = {
            query: `{
                hello(message:"${this.message}")
            }`
        };
        this.fetchData(baseQuery);
    }
    handleSfdxClick() {
        const command = 'commands';
        const flags = `["--json"]`;
        const sfdxQuery = {
            query: `{
                getSfdxCommands(
                    command:"${command}",
                    flags:${flags}
                    ){
                        total
                        commands{ id description } 
                    }
            }`
        };
        this.fetchData(sfdxQuery);
    }

    async fetchData(query) {
        try {
            const response = await getData(query);
            if (response) {
                console.log('SUCCESS ' + JSON.stringify(response));
                this.response = JSON.stringify(response);
            }

        } catch (err) {
            console.log('error : ' + JSON.stringify(err));
        }
    }

    get pageTitle() {
        return `Path : ${this.pathName}`;
    }
}
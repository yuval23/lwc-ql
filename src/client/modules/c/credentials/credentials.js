import { LightningElement, api, track } from 'lwc';
import { reportFormValidity } from '../../utils/formUtils';

const LOGIN_INPUTS = ['username', 'instanceUrl', 'password', 'securityToken'];

export default class Credentials extends LightningElement {
    @track inputFields = LOGIN_INPUTS;

    // Check and inform validy 
    // Build object from input values
    @api
    getFormInputs() {
        const inputs = this.template.querySelectorAll('.login-input');
        const valid = reportFormValidity(inputs);
        let formInputs = {};
        if (valid) {
            inputs.forEach(el => {
                if (el.value) {
                    formInputs[el.name] = el.value;
                }
            });
        }
        return {
            formInputs,
            valid
        };
    }
}

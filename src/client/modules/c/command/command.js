import { LightningElement, api, track } from 'lwc';
import { reportFormValidity } from '../../utils/formUtils';

const DEFAULT_FLAGS = [{
    "name": "json",
    "defaultValue": true,
    "required": true,
    "type": "checkbox",
    "description": "format output as json",
    "char": null,
    "options": null,
    "disabled": true
}];

export default class Command extends LightningElement {
    @api
    get command() {
        return this._command;
    }
    set command(value) {
        this._command = value;
    }
    @api
    get flags() {
        return this._flags.map((item, index) => ({
            ...item,
            type: item.type === "boolean" ? "checkbox-button" : item.type,
            checked: item.defaultValue,
            allowRemove: index > 0,
            index
        }));
    }
    set flags(value) {
        this._flags = [...value];
    }


    @track _flags = DEFAULT_FLAGS;
    _command = 'commands';
    disabled = true;

    toggleEditMode(event) {
        this.disabled = !this.disabled;
        // toggle button icon
        const button = event.target;
        button.iconName = this.disabled ? 'utility:edit' : 'utility:close';
    }
    handleCommandChange(event) {
        this._command = event.target.value;
    }

    handleFlagChange(event) {
        const fieldName = event.target.name;
        const fieldValue = event.target.value;
        const fieldType = event.target.type;
        const flagIndex = this.flags.findIndex(flag => flag.name === fieldName);

        if (fieldType === 'field') {
            this._flags[flagIndex].name = fieldValue;
        } else if (fieldType === 'value') {
            this._flags[flagIndex].value = fieldValue;
        }

    }

    // Handle Add/Remove Flag
    handleAddFlag() {
        this._flags.push({});
    }
    handleRemoveFlag(event) {
        const flagIndex = event.target.dataset.index;
        // prevent first row remove
        if (flagIndex > 0) {
            this._flags.splice(flagIndex, 1);
        }
    }


    // Expose Values to parent component
    @api
    getOutputCommand() {
        let flags = [];
        const flagNames = this.template.querySelectorAll('.flag-key');
        const flagValues = this.template.querySelectorAll('.flag-value');
        const valid = reportFormValidity([...flagNames, ...flagValues]);
        // get flag input values
        if (flagNames.length) {
            flagNames.forEach(flagKey => {
                flagValues.forEach(flagValue => {
                    if (flagKey.name === flagValue.name) {
                        if (flagValue.value) {
                            flags.push(`--${flagKey.value}=${flagValue.value}`);
                        } else {
                            flags.push(`--${flagKey.value}`);
                        }

                    }
                })
            });
        }

        return {
            valid: valid,
            command: this.command,
            flags: [...flags]
        }
    }

}
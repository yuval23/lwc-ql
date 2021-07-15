// Check all required inputs are populated or pop input validity
export function checkInputsValidity(inputs) {
    return [...inputs].reduce((validSoFar, inputField) => {
        inputField.reportValidity();
        return validSoFar && inputField.checkValidity();
    }, true);
}
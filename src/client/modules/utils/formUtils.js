// Check all required inputs are populated or pop input validity
export function reportFormValidity(inputs) {
    return [...inputs].reduce((validSoFar, inputField) => {
        inputField.reportValidity();
        return validSoFar && inputField.checkValidity();
    }, true);
}
function validateChecks(checks){
    return {
        isValid: true,
        error: null
    }
}

function validateConditions(conditions){
    if(conditions == null){
        return {
            isValid: true,
            error: null
        };
    }

    return {
        valid: false,
        error: new Error("Not implemented conditions yet")
    };
}

module.exports = {validateChecks,validateConditions}
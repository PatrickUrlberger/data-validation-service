const checker = require("./checker");
const configVerifier = require("./configVerifier")

/**
 * This is a description of the MyClass constructor function.
 * @class
 * @classdesc This is a description of the MyClass class.
 */
class ValidationService {


    #checks;
    #conditions;

    /**
         * @param {Object} config - The Configuration of the Service. Includes a validation scheme and some optional conditions for the check.
         * @param {Object} config.checks -  
         * The used validation checks provided as an object.   
         * The objects keys must equal the keys of the json you want to validate.  
         * As values you have different Options:
         *   
         * Data Types  
         *   
         * The validator will check if the incoming data has the correct type:  
         * Just set the class of the type you want to check as the value  
         * For example:    
         *  
         * {  
         *   "Name": String  
         *   "Age": Number  
         *   "Categories": Array    
         *   "Adress": Object  
         * }  
         *   
         * Some prebuilt checks 
         *   
         * The validator has some prebuilt checks that appear in many use cases:  
         * Just set the check you want to use as a string value
         * You can set the following checks at the moment:    
         * 
         * ["email","phonenumber","url"]
         *  
         * For example:  
         * {  
         *   "customerMail": "email"  
         *   "customerPhone": "phonenumber"  
         *   "homepage": "url"     
         * }
         * 
         * RegExp
         * 
         * If you provide a regex as value the valitor will use it to verify the data  
         * For example:  
         * 
         * {    
         *   "mathGrade": /([1-6])/  
         *   "physicsGrade": new RegExp("([1-6])")  
         * }  
         * 
         * Custom Check
         * You can also provide functions that perform a custom check
         * Every function takes 2 paramters
         * 1. value: The value that should be checked
         * 2. context: The other data that is validates at the moment  
         * The function must return true if the check was sucessfull  
         * and false if not  
         * 
         * For example:  
         * {  
         *  childrenCount: function (value,context) {  
         *  if(context.hasChildren){  
         *      return value > 0  
         * }  
         * else {  
         *  return true  
         * }  
         * }  
         * }  
         * 
         * 
         * 
         * @param {Array} config.conditions -  
         * Some optional conditions used in the check.
         * These can be useful in the following situations  
         * -Either value A or value B must be provided  
         * -Value A is required  
         * -Value B is optional  
         * -value B must ony be provided if value A is equal to something special  
         * -value B must have a certain value if value A has a certain value  
         * 
         * The condition object follows this syntax: 
         * 
         * 
         *  conditionType: ("or, "and", "xor","ifThen", "optional", "required")
         * 
         * if conditionType is set to "optional" or "required" provide a parameter named "key" that has the keyname set that is optional  
         * or required    
         * For Example:  
         * [{  
         * "conditionType": "required",
         * "key": "email"  
         * },  
         * {  
         * "conditionType": "optional"
         * "key": "phonenumber"  
         * }]  
         * 
         * if conditionType is set to "or","and" or "xor" provided two paramters named "keyA", and "keyB" that should be compared
         * For example:
         * 
         * [{  
         * "conditionType": "or",  
         * "keyA": "phonenumber",  
         * "keyB": "keyname"  
         * },  
         * {  
         * "conditionType": "and",  
         * "keyA": "country",  
         * "keyB": "city"  
         * },  
         * {  
         * "conditionType:": "xor",  
         * "keyA": "onSiteMeetingLocation",  
         * "keyB": "onLineMeetingLink"  
         * }]  
         * 
         * if conditionType is set to "ifThen" provide a parameter named "if". This must be an array
         * 
         * 1. the keyname that must fulfill the condition
         * 2. "isSet" or "equals"
         * 
         * if "isSet" is provided  the third item must be a boolean specifying if the value should be set or not  
         * 
         * if "equals" is set provided a value that must be the value the key should equal.
         * you can also specify multiple values, just add more items to the array 
         * 
         * 
         * As a second parameter the provide a key named "else" that follows the same syntax.
         * The condition is either fulfilled if the "if" condition is true and the then condition is true
         * or if the "if" condition is false
         * 
         * For Example:
         * 
         * [{  
         * "conditionType": "ifThen",  
         * "if": ["maritalStatus","equals","married"],  
         * "then": ["spouse","isSet",true],  
         * },  
         * {  
         * "conditionType": "idThen",  
         * "if": ["equals", "salary",false],  
         * "then": ["careerStatus","equals","student","unemployed","kindergarden"],  
         * }  
         * ]
         *   
         * 
     */
    constructor({checks,conditions}){

        const checkValidation = configVerifier.validateChecks(checks);
        if(!checkValidation.isValid){
            throw checkValidation.error
        }
        const conditionValidation = configVerifier.validateConditions(conditions);
        if(!conditionValidation.isValid){
            throw conditionValidation.error
        }

        this.#checks = checks;
        this.#conditions = conditions;
    }


    /**
     * The result of the checks.
     * @typedef {Object} CheckResult
     * @property {Object} correct - Indicates whether the Courage component is present.
     * @property {Array} missing - Indicates whether the Power component is present.
     * @property {Object} wrong - Indicates whether the Wisdom component is present.
     * @property {Object} errorReport
     */


    /**
     * Performs the checks configured in the validation service
     * @param {Object} data
     * @returns {CheckResult} The result contains the following keys:
     * - correct - Object of all keys that were sucessfully verified.  
     * - missing - Array of all keys that were missing.  
     * - wrong - Object with all keys that failed a check or didnt satisfy a condition.  
     * - errorReport - Object summing up everyting that when wrong during the check.
     */
    run(data){
        return checker.runChecks(data,this.#checks,this.#conditions);
    }


};

module.exports = ValidationService
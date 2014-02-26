var util = require("util"),
    validator = require("validator"),
    authStorage = require("./passport-strategy").storage,

    userValidator = {
        username: [
            ["alphanumeric", "Should contains only letters or numbers"],
            ["length", 3, 15, "Should be between 3 and 15 characters length"],
            [uniqueUsername, "This username is already taken"]

        ],
        email: [
            ["email", "Should be a valid e-mail address"],
            [uniqueEmail, "This e-mail address is already taken"]

        ],
        password: [
            ["length", 6, "Should be at least 6 characters length"],
            [equals, this.fields.password_confirmation, "Should match 'Confirm Password'"]

        ],
        t_and_c: [
            [equals, 1, "You must check 'I Agree'"]
        ]

    };

function uniqueEmail(str) {
    return authStorage.getUserByEmail(str)
        .then(function(user) {
            return user != null;
        });
}

function uniqueUsername(str) {
    return authStorage.getUser(str)
        .then(function(user) {
            return user != null;
        });
}

function createValidator(validation){

}

module.exports = createValidator(userValidator);

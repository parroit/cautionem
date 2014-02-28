var passport = require("passport"),
    util = require("util"),
    userValidate = require("./auth/user-validator"),
    authStorage = require("./passport-strategy").storage;

var login = passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/login",
    failureFlash: true
});

function logout(req, res) {
    req.logout();
    res.redirect("/");
}

function saveUser(user, req, res) {
    authStorage.saveUser(user)
        .then(function(results) {
            
            if (results.status == "ok") {
                req.flash("info", "You have successfully registered.");
            } else {
                req.flash("error", results.reason);
            }

            res.redirect("/");
        })

        .then(null, function(err) {
            
            req.flash("error", err.message);
            res.redirect("/subscribe");
        });

}

function subscribe(req, res) {

    var user = req.body;

    userValidate(user, authStorage, function(validation) {
        if (validation.errors) {
            res.render("subscribe", {
                user: user,
                userErrors: validation.errors,
                partials: {
                    navbar: "navbar",
                    dialogs: "dialogs"
                }
            });
        } else {
            saveUser(user, req, res);
        }

    });

}


module.exports = {
    subscribe: subscribe,
    login: login,
    logout: logout
};

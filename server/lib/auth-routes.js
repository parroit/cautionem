var passport = require("passport"),
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

function subscribe(req, res) {

    var user = req.body;

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


module.exports = {
    subscribe: subscribe,
    login: login,
    logout: logout
};

var passport = require("passport"),
    authStorage = require("./passport-strategy").storage;

exports.postLogin = passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/login",
    failureFlash: true
});

exports.logout = function(req, res) {
    req.logout();
    res.redirect("/");
}

exports.subscribe = function(req, res) {
    
    var user = req.body;

    authStorage.saveUser(user)
    	.then(function(results){
    		if (results.status == "ok") {
                            req.flash("info", "You have successfully registered.");
    		} else {
                            req.flash("error", results.reason);
    		}

                        res.redirect("/");
    	})

    	.then(null, function(err){
    		req.flash("error", err.message);
                        res.redirect("/subscribe");
    	});

    
    
}

var routes = require("./routes"),
    passport = require("passport"),
    authRoutes = require("./auth-routes");


function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/login')
}


module.exports = function(app) {
    /**
     * web pages
     */
    app.get("/",  routes.template("index"));
    app.get("/index",  routes.template("index"));


    

    /**
     * auth
     */
    app.get('/login', routes.template("login"));
    app.post('/login', authRoutes.postLogin);
    app.get('/logout', ensureAuthenticated, authRoutes.logout);
}

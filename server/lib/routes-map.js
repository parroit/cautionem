var baseRoutes = require("./base-routes"),
    passport = require("passport"),
    billsRoutes = require("./bills/routes"),
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
    app.get("/",  baseRoutes.template("index"));
    app.get("/index",  baseRoutes.template("index"));

    /**
     * auth
     */
    app.get('/login', baseRoutes.template("login"));
    app.post('/login', authRoutes.login);
    app.get('/subscribe', baseRoutes.template("subscribe"));
    app.post('/subscribe', authRoutes.subscribe);
    app.get('/logout', ensureAuthenticated, authRoutes.logout);

    /**
     * bills
     */
    app.get('/bills/list', billsRoutes.listBills);
    app.get('/bills/:code', billsRoutes.editBill);
    app.get('/bill-data/:code', billsRoutes.bill);
    

}

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
    app.get('/cliente/:codicefiscale', billsRoutes.cliente);
    app.get('/bills/:code', billsRoutes.editBill);
    app.get('/bills/print/:code', billsRoutes.printBill);
    app.get('/bills/print-new-format/:code', billsRoutes.printBillNewFormat);
    app.get('/bills/pdf-print/:code', billsRoutes.pdfPrintBill);
    app.get('/bills/pdf-print-new-format/:code', billsRoutes.pdfPrintBillNewFormat);
    app.get('/bills-new', billsRoutes.newBill);
    app.get('/bill-data/:code', billsRoutes.bill);
    app.post('/bill-data/:code', billsRoutes.saveBill);
    

}

var assert = require("assert"),
    expect = require("expect.js"),
    initData = require("./init-db-data"),

    app = require("../../lib/bills-storage");


app.init({
    couch: {db: "http://localhost:5984/billy-test"}
});
describe("articoliIva", function () {
    before(function(done){
        initData(done);
    });
    it("is defined", function () {
        expect(app.articoliIva).to.be.an('object');
    });
    describe("all", function () {
        var articoliIva;
        before(function (done) {
            app.articoliIva.all().then(
                function success(result) {
                    articoliIva = result;
                    done();
                }, function fail(err) {
                    throw err;
                }
            );
        });

        it("is defined", function () {
            expect(app.clienti.all).to.be.an('function');
        });

        it("return all articoliIva", function () {
            expect(articoliIva).to.be.an('array');
            expect(articoliIva.length).to.be.equal(1);
            expect(articoliIva[0].description).to.be.equal("Art.10 c.6 DPR 633");
        });

        it("returned articoliIva has id", function () {
            expect(articoliIva[0]._id).to.be.a('string');

        });

        it("returned articoliIva has type", function () {
            expect(articoliIva[0].type).to.be.equal('articoloIva');

        });

        it("returned articoliIva has revision", function () {
            expect(articoliIva[0]._rev).to.be.a('string');

        });
    });

   
});


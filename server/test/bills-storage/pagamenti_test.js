var assert = require("assert"),
    expect = require("expect.js"),
    initData = require("./init-db-data"),

    app = require("../../lib/bills-storage");


app.init({
    couch: {db: "http://localhost:5984/billy-test"}
});
describe("pagamenti", function () {
    before(function(done){
        initData(done);
    });
    it("is defined", function () {
        expect(app.pagamenti).to.be.an('object');
    });
    describe("all", function () {
        var pagamenti;
        before(function (done) {
            app.pagamenti.all().then(
                function success(result) {
                    pagamenti = result;
                    done();
                }, function fail(err) {
                    throw err;
                }
            );
        });
        it("is defined", function () {
            expect(app.clienti.all).to.be.an('function');
        });

        it("return all pagamenti", function () {
            expect(pagamenti).to.be.an('array');
            expect(pagamenti.length).to.be.equal(1);
            expect(pagamenti[0].description).to.be.equal("Bonifico 30 gg. f.m.");
        });

        it("returned pagamenti has id", function () {
            expect(pagamenti[0]._id).to.be.a('string');

        });
        it("returned pagamenti has type", function () {
            expect(pagamenti[0].type).to.be.equal('pagamento');

        });
        it("returned pagamenti has revision", function () {
            expect(pagamenti[0]._rev).to.be.a('string');

        });
    });

   
});


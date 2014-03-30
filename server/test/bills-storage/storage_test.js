var assert = require("assert");
var expect = require("expect.js");
var app = require("../../lib/bills-storage");


describe("app", function () {
    it("is defined", function () {
        expect(app).to.be.an('object');
    });

    describe("init", function () {
        it("is defined", function () {
            expect(app.init).to.be.a('function');
        });

        it("save options", function () {
            app.init({
                couch:{db: "http://localhost:5984/billy-test"}
            });
            expect(app.options.couch.db).to.be.equal("http://localhost:5984/billy-test");
        });
    });



});

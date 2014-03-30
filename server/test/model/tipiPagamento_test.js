var assert = require("assert"),
    expect = require("expect.js"),
    _ = require("lodash"),
    tipiPagamento = require("../../lib/model/TipiPagamento");



describe("tipiPagamento", function () {

    it("is defined", function () {
        expect(tipiPagamento).to.be.a('function');
    });

    it("create an instance", function () {
        var expected = {
            description: "",
            giorni: 30,
            fineMese: false ,
            type:"pagamento"
        };
        expect(_.isEqual(tipiPagamento(),expected)).to.be.equal(true);
    });


});
var assert = require("assert"),
    expect = require("expect.js"),
    _ = require("lodash"),
    articoliIva = require("../../lib/model/ArticoliIva");



describe("articoliIva", function () {

    it("is defined", function () {
        expect(articoliIva).to.be.a('function');
    });

    it("create an instance", function () {
        var expected = {
            clausolaStampa: "",
            percentuale: 20,
            description: "",
            type: "articoloIva"
        };
        expect(_.isEqual(articoliIva(),expected)).to.be.equal(true);
    });


});
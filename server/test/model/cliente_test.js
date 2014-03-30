var assert = require("assert"),
    expect = require("expect.js"),
    _ = require("lodash"),
    cliente = require("../../lib/model/Cliente");



describe("cliente", function () {

    it("is defined", function () {
        expect(cliente).to.be.a('function');
    });

    it("create an instance", function () {
       var expected = {
            secondaDescrizione: "",
            partitaIva: "",
            codiceFiscale: "",
            fornitore: false,
            cliente: true,
            indirizzo: "",
            cap: "",
            comune: "",
            provincia: "",
            description:  "",
            type: "cliente"
        };
        expect(_.isEqual(cliente(),expected)).to.be.equal(true);
    });


});
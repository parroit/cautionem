var assert = require("assert"),
    expect = require("expect.js"),
    _ = require("lodash"),
    enhanceRiga = require("../../lib/model/enhance-rigafattura.js"),
    rigaFattura = require("../../lib/model/RigaFattura"),

    datiRiga = {
        prezzoCadauno: 500,
        quantita: 2
    },

    datiRiga2 = {
        prezzoCadauno: 200,
        quantita: 2
    };

describe("rigaFattura", function () {

    it("is defined", function () {
        expect(rigaFattura).to.be.a('function');
    });

    it("create an instance", function () {
        var expected = {
            description: "",
            prezzoCadauno: 0,
            quantita: 1,
            numeroRiga: 0
        };
        expect(_.isEqual(rigaFattura(),expected)).to.be.equal(true);
    });

    describe("enhanceRiga", function () {
        var riga;
        var riga2;
        before(function () {
            riga = enhanceRiga(datiRiga);
            riga2 = enhanceRiga(datiRiga2);
        });


        it("is defined", function () {
            expect(enhanceRiga).to.be.an('function');
        });

        it("add calculated total", function () {
            expect(datiRiga.total).to.be.equal(1000);
        });

        it("change with quantita", function () {
            datiRiga.quantita = 4;
            expect(datiRiga.total).to.be.equal(2000);
            datiRiga.quantita = 2;
        });

        it("work for multiple rows", function () {
            expect(datiRiga2.total).to.be.equal(400);
        });
    });
});
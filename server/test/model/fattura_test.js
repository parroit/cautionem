var assert = require("assert"),
    expect = require("expect.js"),
    moment = require('moment'),
    enhanceFattura = require("../../lib/isomorphic/model/enhance-fattura"),
    _ = require("lodash"),
    factory = require("../../lib/model/Fattura");



var datiFt = {
    date: moment("2013-12-25").valueOf(),
    articoloIva: {
        percentuale: 22
    },
    righe: [
        {
            prezzoCadauno: 200, quantita: 2
        },
        {
            prezzoCadauno: 100, quantita: 3
        }
    ],
    pagamento: {
        fineMese: false,
        giorni: 30
    }

};

var datiFt2 = {
    date: 1240610400000,
    articoloIva: {
        percentuale: 22
    },
    righe: [
        {
            prezzoCadauno: 200, quantita: 10
        },
        {
            prezzoCadauno: 100, quantita: 3
        }
    ],
    pagamento: {
        fineMese: false,
        giorni: 30
    }

};

describe("fattura", function () {


    describe("factory",function(){

        var ft;

        before(function(){
            ft = factory();
        });

        it("is defined", function () {
            expect(factory).to.be.a('function');
        });

        it("return well formed bill", function () {
            var today = new Date();
            today.setHours(0,0,0,0);
            var expected = {
                date: today.getTime(),
                articoloIva:  {
                    clausolaStampa: '',
                    percentuale: 20,
                    description: '',
                    type: 'articoloIva'
                },
                cliente: {
                    secondaDescrizione: '',
                    partitaIva: '',
                    codiceFiscale: '',
                    fornitore: false,
                    cliente: true,
                    indirizzo: '',
                    cap: '',
                    comune: '',
                    provincia: '',
                    description: '',
                    type: 'cliente'
                },
                anno: today.getFullYear(),
                pagata: false,
                formattedCode: "",
                description: "",
                pagamento:  {
                    description: '',
                    giorni: 30,
                    fineMese: false,
                    type: 'pagamento'
                },
                righe: [],
                type: "fattura"

            };
            //console.dir(ft)
            expect(_.isEqual(expected,ft)).to.be.equal(true);
        });

        it("returned bill has type", function () {
            expect(ft.type).to.be.equal('fattura');

        });
    });

    describe("enhanceFattura", function () {
        var ft;
        var ft2;
        before(function () {
            ft = enhanceFattura(datiFt);
            ft2 = enhanceFattura(datiFt2);
        });


        it("is defined", function () {
            expect(enhanceFattura).to.be.an('function');
        });
        describe ("imponibile",function(){
            it("add property", function () {
                expect(ft.imponibile).to.be.equal(700);
            });

            it("change with quantita riga", function () {
                datiFt.righe[0].quantita = 4;
                expect(ft.imponibile).to.be.equal(1100);
                datiFt.righe[0].quantita = 2;
            });

            it("work for multiple rows", function () {
                expect(ft2.imponibile).to.be.equal(2300);
            });
        });

        describe ("totale",function(){
            it("add property", function () {
                expect(ft.totale).to.be.equal(854);
            });

            it("change with quantita riga", function () {
                datiFt.righe[0].quantita = 4;
                expect(ft.totale).to.be.equal(1342);
                datiFt.righe[0].quantita = 2;
            });

            it("work for multiple rows", function () {
                expect(ft2.totale).to.be.equal(2806);
            });
        });

        describe ("iva",function(){
            it("add property", function () {
                expect(ft.iva).to.be.equal(154);
            });

            it("change with quantita riga", function () {
                datiFt.righe[0].quantita = 4;
                expect(ft.iva).to.be.equal(242);
                datiFt.righe[0].quantita = 2;
            });

            it("work for multiple rows", function () {
                expect(ft2.iva).to.be.equal(506);
            });
        });

        describe ("scadenza",function(){
            it("add property", function () {
                expect( moment(ft.scadenza).format("YYYY-MM-DD")).to.be.equal("2014-01-24");
            });

            it("change with numero giorni", function () {
                datiFt.pagamento.giorni = 31;
                expect( moment(ft.scadenza).format("YYYY-MM-DD")).to.be.equal("2014-01-25");
                datiFt.pagamento.giorni = 30;
            });


            it("change with date", function () {
                datiFt.date = moment("2013-12-24").valueOf();
                expect( moment(ft.scadenza).format("YYYY-MM-DD")).to.be.equal("2014-01-23");
                datiFt.date = moment("2013-12-25").valueOf();
            });

            it("change with fineMese", function () {
                datiFt.pagamento.fineMese = true;
                expect( moment(ft.scadenza).format("YYYY-MM-DD")).to.be.equal("2014-01-30");
                datiFt.pagamento.fineMese = false;
            });


        });


    });
});

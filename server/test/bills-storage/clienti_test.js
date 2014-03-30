var assert = require("assert"),
    expect = require("expect.js"),
    initData = require("./init-db-data"),

    app = require("../../lib/bills-storage");


app.init({
    couch: {db: "http://localhost:5984/billy-test"}
});
describe("clienti", function () {
    before(function(done){
        initData(done);
    });

    it("is defined", function () {
        expect(app.clienti).to.be.an('object');
    });
    describe("all", function () {
        var customers;
        before(function (done) {
            app.clienti.all().then(
                function success(result) {
                    customers = result;
                    done();
                }, function fail(err) {
                    throw err;
                }
            );
        });
        it("is defined", function () {
            expect(app.clienti.all).to.be.an('function');
        });

        it("return all customers", function () {
            expect(customers).to.be.an('array');
            expect(customers.length).to.be.equal(1);
            expect(customers[0].partitaIva).to.be.equal("01513860997");
        });

        it("returned customers has id", function () {
            expect(customers[0]._id).to.be.a('string');

        });

        it("returned customers has revision", function () {
            expect(customers[0]._rev).to.be.a('string');

        });
    });

    var customer;

    function loadOne(code, done) {
        app.clienti.byCode(code).then(
            function success(result) {
                customer = result;
                done();
            }, function fail(err) {

                console.log(err);
                throw err;
            }
        );
    }

    var deleteResult;

    function deleteAndRetrieve(code, done) {

        app.clienti.delete(code).then(
            function success(result) {
                deleteResult = result;
                app.clienti.byCode(code).then(
                    function success(result2) {
                        customer = result2;
                        done();
                    }, function fail(err) {

                        console.log(err);
                        throw err;
                    }
                );
            }, function fail(err) {

                //console.log("DELETE:",err);
                done();
            }
        );
    }

    function saveAndRetrieve(code, document, done) {
        app.clienti.save(document).then(
            function success(result) {
                //console.log(result)
                app.clienti.byCode(code).then(
                    function success(result2) {
                        customer = result2;
                        done();
                    }, function fail(err) {

                        //console.log(err);
                        throw err;
                    }
                );

            }, function fail(err) {

                //console.log(err);
                throw err;
            }
        );
    }

    describe("byCode", function () {
        it("is defined", function () {
            expect(app.clienti.byCode).to.be.an('function');
        });


        describe(" of existing document", function () {
            before(function (done) {
                loadOne("01513860997", done)
            });


            it("return single customer by code", function () {
                expect(customer).to.be.an('object');

                expect(customer.codiceFiscale).to.be.equal("01513860997");
            });

            it("returned customer has id", function () {
                expect(customer._id).to.be.a('string');

            });
            it("returned customer has type", function () {
                expect(customer.type).to.be.equal('cliente');

            });
            it("returned customer has revision", function () {
                expect(customer._rev).to.be.a('string');

            });
        });

        describe(" of unknown document", function () {
            before(function (done) {
                loadOne("bad code", done)
            });


            it("return null", function () {
                expect(customer).to.be.equal(null);


            });

        });


    });




    describe("create", function () {

        before(function (done) {
            deleteAndRetrieve("vattelapesca", function () {
                var customer2 = {
                    codiceFiscale: "vattelapesca",
                    descrizione: "cliente",
                    type: "cliente"
                };

                saveAndRetrieve("vattelapesca", customer2, done);

            });


        });


        it("update document", function () {
            expect(customer.descrizione).to.be.equal("cliente");
            expect(customer.codiceFiscale).to.be.equal("vattelapesca");
            expect(customer._id).to.be.a("string");

        });


    });

    describe("save", function () {
        var original;

        before(function (done) {
            original = customer.descrizione;
            var customer2 = customer;
            customer = null;
            customer2.descrizione = customer2.descrizione + "*";

            saveAndRetrieve("vattelapesca", customer2, done);


        });
        it("is defined", function () {
            expect(app.clienti.save).to.be.an('function');
        });

        it("update document", function () {
            expect(customer.descrizione).to.be.equal(original + "*");

        });


    });

    describe("delete", function () {
        before(function (done) {
            deleteAndRetrieve("vattelapesca", done);
        });

        it("remove document", function () {
            expect(customer).to.be.equal(null);

        });

    });
});


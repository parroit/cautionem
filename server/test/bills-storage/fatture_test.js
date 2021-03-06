var assert = require("assert"),
    expect = require("expect.js"),
    initData = require("./init-db-data"),

    app = require("../../lib/bills-storage");

app.init({
    couch: {db: "http://localhost:5984/billy-test"}
});
describe("fatture", function () {
    before(function(done){
        initData(done);
    });

    it("is defined", function () {
        expect(app.fatture).to.be.an('object');
    });

    describe("byYear", function () {
        var bills;

        before(function(done){
            app.fatture.byYear(new Date().getFullYear()).then(
                function success(result) {
                    bills = result;
                    //console.dir(bills);
                    done();
                }, function fail(err) {
                    //console.dir(err);
                    throw err;
                }
            );
        });

        it("is defined", function () {
            expect(app.fatture.byYear).to.be.an('function');
        });

        it("return all bills of year", function () {
            expect(bills).to.be.an('array');
            expect(bills.length).to.be.equal(1);
            expect(bills[0].anno).to.be.equal(new Date().getFullYear());
        });

        it("returned bills has id", function () {
            expect(bills[0]._id).to.be.a('string');

        });

        it("returned bills has revision", function () {
            expect(bills[0]._rev).to.be.a('string');

        });

        it("returned bills has cliente", function () {
            expect(bills[0].cliente).to.be.a('string');
            expect(bills[0].cliente).to.be.equal('ZSis di Sergio Russo');

        });
    });


    var bill;

    function loadOne(code, done) {
        app.fatture.byCode(code).then(
            function success(result) {
                bill = result;
                done();
            }
        ).then(null, function fail(err) {

                console.log(err);
                throw err;
            }
        );
    }

    var deleteResult;

    function deleteAndRetrieve(code, done) {
        function retrieve() {
            app.fatture.byCode(code).then(
                function success(result2) {
                    bill = result2;
                    done();
                }, function fail(err) {

                    console.log(err);
                    done();
                }
            );
        }

        app.fatture.delete(code).then(
            function success(result) {
                deleteResult = result;
                retrieve();
            }
        ).then(null, function fail(err) {

                console.log(err);
                retrieve();
            });
    }

    function saveAndRetrieve(code, document, done) {
//        console.log("CODE:%s",code);
//        console.log("DOCUMENT CODE:%s",document.formattedCode);
        app.fatture.save(document).then(
            function success(result) {

                app.fatture.byCode(code).then(
                    function success(result2) {
                        //console.log(result2)
                        bill = result2;
                        done();
                    }
                ).then(null, function (err) {
                        console.log("%s\n%s", err.message, err.stack);
                        done();
                    });

            }
        ).then(null, function (err) {
                console.log("%s\n%s", err.message, err.stack);
                done();
            });
    }

    describe("byCode", function () {
        it("is defined", function () {
            expect(app.fatture.byCode).to.be.an('function');
        });


        describe(" of existing document", function () {
            before(function (done) {
                loadOne("0001/2008", done)
            });


            it("return single bill by code", function () {
                expect(bill).to.be.an('object');
                expect(bill.formattedCode).to.be.equal("0001/2008");

            });

            it("returned bill has id", function () {
                expect(bill._id).to.be.a('string');

            });

            it("returned bill has type", function () {
                expect(bill.type).to.be.equal('fattura');

            });


            it("returned bill has revision", function () {
                expect(bill._rev).to.be.a('string');

            });
        });

        describe(" of unknown document", function () {
            before(function (done) {
                loadOne("bad code", done)
            });


            it("return null", function () {
                expect(bill).to.be.equal(null);


            });

        });


    });


    describe("create", function () {

        before(function (done) {
            deleteAndRetrieve("1002/2080", function () {
                var bill2 = {
                    formattedCode: "1002/2080",
                    description: "ultima fattura",
                    type: "fattura"
                };

                saveAndRetrieve("1002/2080", bill2, done);

            });


        });


        it("update document", function () {
            expect(bill.description).to.be.equal("ultima fattura");
            expect(bill.formattedCode).to.be.equal("1002/2080");
            expect(bill._id).to.be.a("string");

        });


    });

    describe("save", function () {
        var original;

        before(function (done) {
            original = bill.description;
            var bill2 = bill;
            bill = null;
            bill2.description = bill2.description + "*";

            saveAndRetrieve("1002/2080", bill2, done);


        });
        it("is defined", function () {
            expect(app.fatture.save).to.be.an('function');
        });

        it("update document", function () {
            expect(bill.description).to.be.equal(original + "*");

        });


    });

    describe("save multiple times", function () {


        before(function (done) {
            var original = bill;
            original.description = "ciao1";

            saveAndRetrieve("1002/2080", original, function () {
                original.description = "ciao2";
                saveAndRetrieve("1002/2080", original, done);

            });


        });


        it("work", function () {
            expect(bill.description).to.be.equal("ciao2");

        });


    });

    describe("delete", function () {
        before(function (done) {
            deleteAndRetrieve("1002/2080", done);
        });

        it("remove document", function () {
            expect(bill).to.be.equal(null);

        });

    });

});
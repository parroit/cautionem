'use strict';

var deps = {
    telescope: "telescope/telescope"
};

describe("ArrayObservable", function() {
    var makeArrayObservable,
        observable;

    before(amdMocha.require(deps, function(mods) {
        makeArrayObservable = mods.telescope.array;
    }));

    before(function() {
        observable = makeArrayObservable([]);
        observable.init(["ciao"]);
    });

    it("is defined", function() {
        expect(makeArrayObservable).to.be.an('function');
    });

    it("emit events", function() {

        expect(observable.events).to.be.an('object');
    });

    it("has length", function() {

        expect(observable.length).to.be.equal(1);
    });

    it("store observables", function() {
        expect(observable).to.be.an('array');
        expect(observable.length).to.be.equal(1);
    });

    describe("push", function() {
        var raised;
        before(function() {
            observable.events.once("changed", function() {
                raised = true
            });
            observable.push("salve");
        });

        it("alter length", function() {
            expect(observable.length).to.be.equal(2);

        });

        it("emit changed event", function() {
            expect(raised).to.be.equal(true);

        });
        it("store observable value to observables", function() {

            expect(observable.length).to.be.equal(2);
        });
        it("store value to observed", function() {
            expect(observable.observed.length).to.be.equal(2);
            expect(observable.observed[1]).to.be.equal("salve");
        });
    });

    describe("forEach", function() {
        it("loop all elements in array", function() {
            var results = "";
            observable.forEach(function(observableItem) {
                results += "-" + observableItem.observed;
            });
            expect(results).to.be.equal("-ciao-salve");
        });
    });
    
    describe("remove", function() {
        var raised;
        before(function() {
            observable.events.once("changed", function() {
                raised = true
            });
            observable.remove(0);
        });

        it("alter length", function() {
            expect(observable.length).to.be.equal(1);

        });

        it("emit changed event", function() {
            expect(raised).to.be.equal(true);

        });
        it("remove observable value from observables", function() {

            expect(observable.length).to.be.equal(1);
        });
        it("remove value from observed", function() {
            expect(observable.observed.length).to.be.equal(1);
            expect(observable.observed[0]).to.be.equal("salve");
        });
    });
});

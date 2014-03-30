'use strict';

var deps = {
    EventEmitter: "eventEmitter",
    telescope: "telescope/telescope",
    FormPresenter: "forms/FormPresenter"
};

describe("form-presenter", function() {
    var view,
        observed,
        formPresenter,
        observable,
        FormPresenter;


    before(amdMocha.require(deps, function(mods) {

        view = {
            events: new mods.EventEmitter(),
            set: function(propertyName, value) {
                this[propertyName] = value;
                this.events.emit('changed', propertyName, value)
            }
        }
        observable = new mods.telescope.object();
        observed = {
            aProperty: null
        }
        observable.init(observed);

        FormPresenter = mods.FormPresenter;
        formPresenter = new FormPresenter(observable, view);
        formPresenter.start();
    }));



    it("is defined", function() {
        expect(FormPresenter).to.be.an('function');
    });

    it("is creatable", function() {
        expect(formPresenter).to.be.an('object');
    });

    describe("start", function() {
        it("is defined", function() {
            expect(formPresenter.start).to.be.an('function');
        });
    });

    it("set observable property on view changed event", function() {
        view.events.emit('changed', 'aProperty', 112);
        expect(observed.aProperty).to.be.equal(112);
    });

    it("set view property on observable changed event", function() {
        observable.events.emit('changed', 'aProperty', 113);
        expect(view.aProperty).to.be.equal(113);
    });


});

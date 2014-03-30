'use strict';

var deps = {
    telescope: "telescope/telescope"
};

describe("telescope", function() {
    var modules = {};
    before(amdMocha.require(deps, function(mods) {
        console.dir(mods)
        modules = mods;
    }));
    
    it("is defined", function() {
        expect(modules.telescope).to.be.an('object');
    });

    it("export object observables", function() {
        expect(modules.telescope.object).to.be.an('function');
    });

     it("export array observables", function() {
        expect(modules.telescope.array).to.be.an('function');
    });
});

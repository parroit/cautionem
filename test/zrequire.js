
function zrequire() {

    var modules = {},
        moduleNames = Array.prototype.slice.call(arguments);

    moduleNames.push("chai-amd");

    before(function(done) {
        requirejs(moduleNames, function() {

            var results = Array.prototype.slice.call(arguments),
                i = 0,
                l = results.length - 1,
                chai = results[l];




            chai.should();

            for (; i < l; i++) {
                var moduleName = moduleNames[i],
                    nameStart = moduleName.lastIndexOf("/");

                if (nameStart > -1) {
                    moduleName = moduleName.substring(nameStart+1);
                }

                modules[moduleName] = results[i];

            }




            done();

        });
    });

    return modules;
}

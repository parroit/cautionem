(function(exports) {

    function requireMocha(modules, cb) {
        return function(done) {
            require.config({
                baseUrl: "/js",
                paths: thirdPartyConfig,
                shims: thirdPartyShims,
                noGlobal: true
            });

            var moduleNames = Object.keys(modules),
                modulePaths = moduleNames.map(function(name) {
                    return modules[name];
                });

            require(modulePaths, function() {
                var modules = {},
                    i = 0,
                    l = arguments.length;

                for (; i < l; i++) {
                    var module = arguments[i],
                        moduleName = moduleNames[i];

                    modules[moduleName] = module;
                }

                cb(modules);
                done();
            });

        }
    }


    exports.amdMocha = {
        require: requireMocha
    }
})(window);

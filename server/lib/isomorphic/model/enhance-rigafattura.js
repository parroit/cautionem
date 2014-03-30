
function defineModule(moment, _){
    function define(obj,propertyName,getFunction){
        delete obj[propertyName];
        Object.defineProperty(obj, propertyName, {
            get: getFunction,
            enumerable: true,
            configurable: true
        });
    }

    function enhanceRiga(dati) {
        define(dati, "total", function () {

            var total = this.prezzoCadauno * this.quantita;
            //console.log("TOTAL: %d",total);
            return  total;
        });
        return dati;
    }

    return enhanceRiga;
}

if (typeof module != "undefined" && module.exports) {
    module.exports = defineModule(
        require('moment'),
        require("lodash")
    );    
} else {
    define(["moment","lodash"],defineModule);
}



function defineModule(moment, enhanceRiga, _) {
    function define(obj,propertyName,getFunction){
        delete obj[propertyName];
        Object.defineProperty(obj, propertyName, {
            get: getFunction,
            enumerable: true,
            configurable: true
        });
    }

    function enhanceFattura(dati) {
        dati.righe.forEach(function (riga) {

           enhanceRiga(riga);
        });

        define(dati, "scadenza", function () {
            var dataFt = moment(this.date);
            if (this.pagamento.fineMese) {
                dataFt.endOf('month');
            }

            return dataFt.add('days', this.pagamento.giorni).valueOf();


        });

        define(dati, "imponibile", function () {
            return _(this.righe).map(function (r) {
                return r.total
            })
                .reduce(function (sum, num) {

                    return sum + num;
                });


        });

        define(dati, "iva", function () {
            return this.imponibile * this.articoloIva.percentuale / 100;

        });

        define(dati, "totale", function () {
            return this.imponibile + this.iva;

        });
        return dati;
    }

    enhanceFattura.riga = enhanceRiga;

    return enhanceFattura;
}


if (typeof module != "undefined" && module.exports) {
    
    module.exports = defineModule(
        require('moment'),
        require("./enhance-rigafattura"),
        require("lodash")
    );    
} else {

    define(["moment","/model/enhance-rigafattura.js","lodash"],defineModule);

}


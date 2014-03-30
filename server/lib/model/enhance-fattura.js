var moment = require('moment'),
    enhanceRiga = require("./enhance-rigafattura"),
    _ = require("lodash");


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

module.exports = enhanceFattura;


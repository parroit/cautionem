define(["telescope/telescope", "eventEmitter","/model/enhance-fattura.js"], 
    function(telescope, EventEmitter, enhanceFattura) {
    var makeArrayObservable = telescope.array,
        Observable = telescope.object;

    function ObservableFattura(fattura) {
        fattura.righe.forEach(function(riga) {
            delete riga.total;
            delete riga.totale;
        });

        var _this = this;
        _this.init(fattura);

        _this.righe = makeArrayObservable();
        _this.righe.buildObservableRow = function(row) {
            return new ObservableRiga(row, _this);
        };
        _this.righe.init(fattura.righe);
        _this.righe.events.on('changed', function() {
            _this.events.emit('changed', 'imponibile', _this.imponibile);

        });

        _this.events.on('changed', function(propertyName) {
            if (propertyName == 'imponibile' || propertyName == 'articoloIva') {
                _this.events.emit('changed', 'iva', _this.iva);
                _this.events.emit('changed', 'totale', _this.totale);
            }

            if (propertyName == 'pagamento' || propertyName == 'date') {
                _this.events.emit('changed', 'scadenza', _this.scadenza);
            }
        });

        enhanceFattura(this);
    }

    ObservableFattura.prototype = new Observable();

    ObservableFattura.prototype.pushRiga = function(riga) {
        this.righe.push(riga);



    };


    ObservableFattura.prototype.removeRiga = function(idx) {
        this.righe.remove(idx);

    };



    function ObservableRiga(riga, ft) {
        var _this = this;

        _this.init(riga);
        _this.events.on('changed', function(propertyName) {
            if (propertyName == 'quantita' || propertyName == 'prezzoCadauno') {
                _this.events.emit('changed', 'total', _this.total);

            } else if (propertyName == 'total') {
                ft.events.emit('changed', 'imponibile', ft.imponibile);
            }
        });
    }

    ObservableRiga.prototype = new Observable();


    return {
        ObservableFattura: ObservableFattura,
        ObservableRiga: ObservableRiga
    };

});

var deps = {
  telescope: "telescope/telescope",
  lodash: "lodash",
  moment: "moment",
  observables: "/js/fattura-observable.js",
  enhanceRigaFattura: "/model/enhance-rigafattura.js"
};


describe("Observable", function() {
  var ObservableFattura,
    enhanceRiga,
    ObservableRiga,
    _,
    moment;

  before(amdMocha.require(deps, function(mods) {
    ObservableFattura = mods.observables.ObservableFattura;
    ObservableRiga = mods.observables.ObservableRiga;
    moment = mods.moment;
    _ = mods.lodash;
    enhanceRiga = mods.enhanceRigaFattura;

  }));

  it("is defined", function() {
    expect(ObservableFattura).to.be.an('function');
  });

  it("emit events", function() {
    var observableFattura = new ObservableFattura({
      righe: []
    });
    expect(observableFattura.events).to.be.an('object');
  });


  var observableFattura;
  describe("ObservableFattura", function() {
    var results;

    var datiFt;
    before(function() {
      datiFt = {
        date: 1240610400000,
        articoloIva: {
          percentuale: 22
        },
        applicaRivalsaInps: false,
        applicaRitenutaAcconto: false,
        righe: [{
          prezzoCadauno: 200,
          quantita: 2
                }, {
          prezzoCadauno: 100,
          quantita: 3
                }],
        pagamento: {
          fineMese: false,
          giorni: 30
        }

      };
      //fatturaEnhancer.enhanceFattura(datiFt);
      observableFattura = new ObservableFattura(datiFt);
      observableFattura.events.on('changed', function(propertyName, value) {
        results.push({
          propertyName: propertyName,
          value: value
        });
      });


    });

    it("emit changed event for totale and iva on articoloIva changed", function() {
      results = [];
      observableFattura.articoloIva = {
        percentuale: 10
      };


      expect(_(results).isEqual([{
          "propertyName": "articoloIva",
          "value": {
            "percentuale": 10
          }
        }, {
          "propertyName": "ritenutaAcconto",
          "value": 0
        }, {
          "propertyName": "iva",
          "value": 70
        }, {
          "propertyName": "totale",
          "value": 770
        }
            ])).to.be.equal(true);
    });

    it("emit changed event for scadenza on date changed", function() {
      results = [];
      var date = moment("2013-11-11", "YYYY-MM-DD").valueOf();
      var expectedScadenza = moment("2013-12-11", "YYYY-MM-DD").valueOf();
      observableFattura.date = date;

      expect(_(results).isEqual([{
          propertyName: 'date',
          value: date
                }, {
          propertyName: 'scadenza',
          value: expectedScadenza
                }

            ])).to.be.equal(true);
    });
    it("emit changed event for scadenza on pagamento changed", function() {
      observableFattura.date = 1240610400000;
      results = [];

      var expectedScadenza = moment(1240610400000).add('days', 31).valueOf();


      observableFattura.pagamento = {
        fineMese: false,
        giorni: 31
      };

      var expected = [{
          propertyName: 'pagamento',
          value: {
            fineMese: false,
            giorni: 31
          }
                }, {
          propertyName: 'scadenza',
          value: expectedScadenza
                }

            ];

      expect(_(results).isEqual(expected)).to.be.equal(true);
    });

    it("emit changed event for imponibile, totale, rivalsaInps, ritenutaAcconto and iva on applicaRivalsaInps changed", function() {
      results = [];
      var obsRiga = observableFattura.righe.get(0);
      //console.dir(obsRiga);
      observableFattura.applicaRivalsaInps = true;

      expect(_(results).isEqual([{
          "propertyName": "applicaRivalsaInps",
          "value": true
        }, {
          "propertyName": "rivalsaInps",
          "value": 28
        }, {
          "propertyName": "imponibile",
          "value": 728
        }, {
          "propertyName": "ritenutaAcconto",
          "value": 0
        }, {
          "propertyName": "iva",
          "value": 72.8
        }, {
          "propertyName": "totale",
          "value": 800.8
        }

            ])).to.be.equal(true);


    });

    it("emit changed event for totale, ritenutaAcconto on applicaRitenutaAcconto changed", function() {
      results = [];
      var obsRiga = observableFattura.righe.get(0);
      //console.dir(obsRiga);
      observableFattura.applicaRitenutaAcconto = true;
      console.dir(JSON.stringify(results, null, '\t'))

      expect(_(results).isEqual([{
          "propertyName": "applicaRitenutaAcconto",
          "value": true
        }, {
          "propertyName": "ritenutaAcconto",
          "value": 140
        }, {
          "propertyName": "totale",
          "value": 660.8
        }

            ])).to.be.equal(true);


    });

    it("emit changed event for imponibile, totale, rivalsaInps, ritenutaAcconto and iva on quantita riga changed", function() {
      observableFattura.applicaRivalsaInps = false;
      observableFattura.applicaRitenutaAcconto = false;
      results = [];
      var obsRiga = observableFattura.righe.get(0);
      //console.dir(obsRiga);
      obsRiga.quantita = 1;

      expect(_(results).isEqual([{
          "propertyName": "imponibileBase",
          "value": 500
        }, {
          "propertyName": "rivalsaInps",
          "value": 0
        }, {
          "propertyName": "imponibile",
          "value": 500
        }, {
          "propertyName": "ritenutaAcconto",
          "value": 0
        }, {
          "propertyName": "iva",
          "value": 50
        }, {
          "propertyName": "totale",
          "value": 550
        }

            ])).to.be.equal(true);
    });

    it("emit changed event for imponibile, totale, rivalsaInps, ritenutaAcconto and iva on prezzoCadauno riga changed", function() {
      datiFt.righe[0].quantita = 2;
      observableFattura.applicaRivalsaInps = false;
      observableFattura.applicaRitenutaAcconto = false;
      results = [];

      observableFattura.righe.get(0).prezzoCadauno = 100;


      expect(_(results).isEqual(
        [{
          "propertyName": "imponibileBase",
          "value": 500
      }, {
          "propertyName": "rivalsaInps",
          "value": 0
      }, {
          "propertyName": "imponibile",
          "value": 500
      }, {
          "propertyName": "ritenutaAcconto",
          "value": 0
      }, {
          "propertyName": "iva",
          "value": 50
      }, {
          "propertyName": "totale",
          "value": 550
      }])).to.be.equal(true);
    });


    it("emit changed event for imponibile, totale, rivalsaInps, ritenutaAcconto and iva on riga added", function() {
      observableFattura.applicaRivalsaInps = false;
      observableFattura.applicaRitenutaAcconto = false;
      results = [];
      observableFattura.pushRiga(enhanceRiga({
        prezzoCadauno: 50,
        quantita: 0
      }));

      expect(_(results).isEqual([{
        "propertyName": "imponibileBase",
        "value": 500
      }, {
        "propertyName": "rivalsaInps",
        "value": 0
      }, {
        "propertyName": "imponibile",
        "value": 500
      }, {
        "propertyName": "ritenutaAcconto",
        "value": 0
      }, {
        "propertyName": "iva",
        "value": 50
      }, {
        "propertyName": "totale",
        "value": 550
      }])).to.be.equal(true);
    });

    it("emit changed event for imponibile, totale, rivalsaInps, ritenutaAcconto and iva on riga removed", function() {
      observableFattura.applicaRivalsaInps = false;
      observableFattura.applicaRitenutaAcconto = false;
      results = [];
      observableFattura.removeRiga(2);

      expect(_(results).isEqual([{
        "propertyName": "imponibileBase",
        "value": 500
      }, {
        "propertyName": "rivalsaInps",
        "value": 0
      }, {
        "propertyName": "imponibile",
        "value": 500
      }, {
        "propertyName": "ritenutaAcconto",
        "value": 0
      }, {
        "propertyName": "iva",
        "value": 50
      }, {
        "propertyName": "totale",
        "value": 550
      }])).to.be.equal(true);

    });
  });

  describe("ObservableRiga", function() {
    var results;
    var observableRiga;
    before(function() {
      var riga = {
        quantita: 1,
        prezzoCadauno: 200
      };
      enhanceRiga(riga);
      observableRiga = new ObservableRiga(riga, observableFattura);
      observableRiga.events.on('changed', function(propertyName, value) {
        results.push({
          propertyName: propertyName,
          value: value
        });
      });


    });

    it("emit changed event for total on quantita changed", function() {
      results = [];
      observableRiga.quantita = 2;
      expect(_(results).isEqual([{
        propertyName: 'quantita',
        value: 2
            }, {
        propertyName: 'total',
        value: 400
            }])).to.be.equal(true);
    });

    it("emit changed event for total on prezzoCadauno changed", function() {
      results = [];
      observableRiga.prezzoCadauno = 500;

      expect(_(results).isEqual([{
        propertyName: 'prezzoCadauno',
        value: 500
            }, {
        propertyName: 'total',
        value: 1000
            }])).to.be.equal(true);
    });
  });
});

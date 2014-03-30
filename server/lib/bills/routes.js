var model = require("../model/model"),
    enhanceFattura = require("../model/enhance-fattura"),
    baseRoutes = require("../base-routes"),
    Promise = require("promise"),
    moment = require("moment"),
    billsStorage = require("../bills-storage");

function catchErr(res) {
    return function(err) {
        res.emit("error", err);
    }

}

function listBills(req, res) {
    var year = req.query.year;

    function renderBills(bills) {
        var render = baseRoutes.template("bills/list", null, {
            bills: bills
        });

        render(req, res);
    }

    function enhanceBills(bills) {

        return new Promise(function(resolve, reject) {
            resolve(bills.map(function(ft) {
                ft.editUrl = "/bills/" + encodeURIComponent(ft.codice);
                ft.data = moment(ft.data).format("DD/MM/YY");
                return ft; //enhanceFattura(ft);
            }));
        });
    }



    billsStorage
        .fatture.byYear(year)
        .then(enhanceBills)
        .then(renderBills)
        .then(null, catchErr(res));

}


function editBill(req, res) {
    var code = req.param("code");
    console.dir(code)

    function renderBill(model) {
        
        var render = baseRoutes.template("bills/edit", null, model);

        render(req, res);
    }

    function enhanceLookups(model) {
        var ft = enhanceFattura(model.bill);
        console.dir(model)
        return new Promise(function(resolve, reject) {
            model.clienti.forEach(function(c){
                c.isCurrent = c.codiceFiscale == ft.cliente.codiceFiscale;
            });

            model.pagamenti.forEach(function(p){
                p.isCurrent = p.description == ft.pagamento.description;
            })

            model.articoliIva.forEach(function(a){
                a.isCurrent = a.description == ft.articoloIva.description;
            })

            console.log(ft.date)
            ft.dateFt = moment(ft.date).format("YYYY-MM-DD");
            
            ft.scadenzaFt = moment(ft.scadenza).format("YYYY-MM-DD");
            
            resolve(model);

        });
    }

    function buildModel(clienti, articoliIva, pagamenti, bill) {

        return new Promise(function(resolve, reject) {
            resolve({
                clienti: clienti,
                bill: bill,
                articoliIva: articoliIva,
                pagamenti: pagamenti
            });
        });
    }

    function loadLookups(bill) {
        return Promise.all([
            billsStorage.clienti.all(),
            billsStorage.articoliIva.all(),
            billsStorage.pagamenti.all()
        ]).then(function(res){
            res.push(bill);
            return buildModel.apply(this,res);
        });
    }


    billsStorage
        .fatture.byCode(code)
        .then(loadLookups)
        .then(enhanceLookups)
        .then(renderBill)
        .then(null, catchErr(res));


}



module.exports = {
    listBills: listBills,
    editBill: editBill
}

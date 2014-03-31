define(["jquery", "/model/enhance-fattura.js", "/js/fattura-observable.js", "forms/FormPresenter", "forms/FormView", "hogan"],
    function($, enhanceFattura, observables, FormPresenter, FormView, hogan) {
        var templateContent;

        function bindForms(observedFt) {
            var formView = new FormView("#form-fattura"),
                formPresenter = new FormPresenter(observedFt, formView);

            formView.run();
            formPresenter.start();


            observedFt.righe.forEach(function(riga) {

                var rigaView = new FormView("#riga-" + riga.numeroRiga),
                    rigaPresenter = new FormPresenter(riga, rigaView);

                rigaPresenter.start();
                rigaView.run();
            });
        }


        function deleteRiga(bill, numeroRiga) {
            var riga = bill.righe.filter(function(riga) {
                return riga.numeroRiga == numeroRiga;
            })[0];

            alert(JSON.stringify(riga));
        }

        function nuovaRiga(bill) {
            var riga = {
                numeroRiga: bill.righe.length + 1,
                description: "",
                prezzoCadauno: 0,
                quantita: 1
            },
                template, observableRow, rigaPresenter, rigaView;

            enhanceFattura.riga(riga);

            observableRow = bill.righe.push(riga);


            template = hogan.compile(templateContent);
            $(".edit-fattura tbody").append(template.render(riga));

            rigaView = new FormView("#riga-" + riga.numeroRiga)
            rigaPresenter = new FormPresenter(observableRow, rigaView);

            rigaPresenter.start();
            rigaView.run();

        }

        function start(bill) {

            var observedFt = new observables.ObservableFattura(bill),
                $toggleDettaglioCliente = $(".scelta-cliente button"),
                $dettaglioCliente = $(".cliente-details"),
                $newRow = $("#new-row"),
                $deleteRiga = $(".actions .delete"),
                $save = $("#save");

            $toggleDettaglioCliente.click(function() {
                $dettaglioCliente.toggleClass("hidden");
            });

            bindForms(observedFt);

            observedFt.events.on('changed', function(propertyName, value) {
                $save.removeAttr("disabled");
            });

            $.get("/templates/riga-fattura.html", function(data) {
                templateContent = data;
                $newRow.removeAttr("disabled");

            })

            $newRow.click(function() {
                nuovaRiga(observedFt);
            });

            $deleteRiga.click(function() {
                var numeroRiga = $(this).parents("tr").attr("id");
                numeroRiga = numeroRiga.replace("riga-", "");
                numeroRiga = parseInt(numeroRiga);
                deleteRiga(observedFt, numeroRiga);
            });

            $save.click(function() {
                $.post(buildURL(), bill, function(data, textStatus, jqXHR) {
                    if (data.ok) {
                        alert("fattura salvata");
                    } else {
                        alert("impossibile salvare: " + data.reason);
                    }

                })
            });

        }

        function buildURL() {
            var code = encodeURIComponent($("#formattedCode").val());
            return "/bill-data/" + code;
        }

        return {
            start: function() {


                $(function() {

                    $.getJSON(buildURL(), start);

                });

            }
        };
    });

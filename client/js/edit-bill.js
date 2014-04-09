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
      var idxToRemove = -1;
      bill.righe.forEach(function(riga, idx) {
        if (riga.numeroRiga == numeroRiga) {
          idxToRemove = idx;
        }
      });

      if (idxToRemove >= 0) {
        bill.righe.remove(idxToRemove);
      }
    }

    function nuovaRiga(bill) {
      var riga = {
        numeroRiga: bill.righe.length + 1,
        description: "",
        prezzoCadauno: 0,
        quantita: 1
      },
        template, observableRow, rigaPresenter, rigaView, $riga;

      enhanceFattura.riga(riga);

      observableRow = bill.righe.push(riga);


      template = hogan.compile(templateContent);
      $(".edit-fattura tbody").append(template.render(riga));

      $riga = $("tr#riga-" + riga.numeroRiga);
      $riga.find(".actions .delete").click(function() {

        deleteRiga(bill, riga.numeroRiga);
        $riga.remove();
      });

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

      $("#scelta-cliente").change(function() {
        var $this = $(this),
          cliente = JSON.parse($(this).val());
        $this.attr("disabled", "");
        $.getJSON("/cliente/" + cliente.codiceFiscale, function(cliente) {
          observedFt.cliente = cliente;
          $this.removeAttr("disabled");
        })


      });

      $("#scelta-articoloIva").change(function() {
        observedFt.articoloIva = JSON.parse($(this).val());
      });

      $("#scelta-pagamento").change(function() {
        observedFt.pagamento = JSON.parse($(this).val());
      });

      $deleteRiga.click(function() {

        var $riga = $(this).parents("tr"),
          numeroRiga = $riga.attr("id");

        numeroRiga = numeroRiga.replace("riga-", "");
        numeroRiga = parseInt(numeroRiga);
        deleteRiga(observedFt, numeroRiga);
        $riga.remove();
      });

      $save.click(function() {
        $.ajax(
          buildURL(), {
            data: JSON.stringify(bill),
            complete: billSaved,
            headers: {
                "content-type":"application/json"
            },
            type: "post"
          }
        );
      });

    }

    function billSaved(data, textStatus, jqXHR) {
      if (data.ok) {
        alert("fattura salvata");
      } else {
        alert("impossibile salvare: " + data.reason);
      }

    }

    function buildURL() {
      var code = encodeURIComponent($("#formattedCode").val());
      if (code) {
        return "/bill-data/" + code;
      } else {
        return "/bill-data/new";
      }

    }

    return {
      start: function() {


        $(function() {

          $.getJSON(buildURL(), start);

        });

      }
    };
  });

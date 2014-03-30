define(["jquery", "/model/enhance-fattura.js", "/js/fattura-observable.js", "forms/FormPresenter", "forms/FormView"],
    function($, enhanceFattura, observables, FormPresenter, FormView) {
        return {
            start: function() {


                $(function() {
                    var code = encodeURIComponent($("#formattedCode").val());
                    $.getJSON("/bill-data/" + code, function(bill) {

                        var observedFt = new observables.ObservableFattura(bill),
                            formView = new FormView("#form-fattura"),
                            formPresenter = new FormPresenter(observedFt, formView);

                            formView.run();
                            formPresenter.start();

                        var $pre = $("<pre>");
                        $("body").append($pre);
                        observedFt.events.on('changed', function(propertyName, value) {
                            $pre.append(propertyName + ": " + value+"\n");
                        });

                    });

                });

            }
        };
    });

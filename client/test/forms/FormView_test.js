'use strict';

var deps = {
    $: "jquery",
    FormView: "forms/FormView"
};


describe("form-view", function() {
    var $,
        FormView,
        formView,
        handlers = {},
        originalChange,

        testContent = '<div id="testContent"><div id="div1"><input id="fieldDate" type="date"><input id="field1"><select id="field2"></select><textarea id="field3"></textarea></div>' +
            '<div id="div2"><input id="field1A"><select id="field2B"></select><textarea id="field3C"></textarea></div></div>';




        
    before(amdMocha.require(deps, function(mods) {
        $ = mods.$;
        FormView = mods.FormView;
        formView = new FormView("#testContent #div1");
        $("body").append(testContent);
        
        var $a = $("a");
        originalChange = $a.__proto__.change;
        $a.__proto__.change = function(handler) {

            $(this).each(function() {
                var key = $(this).attr("id");
                if (key in handler)
                    throw new Error("handler already present for " + key);
                handlers[key] = handler;
            });
        };

    }));

    after(function(){
        var $a = $("a");
        $a.__proto__.change = originalChange;
        $("testContent").remove();
    });

    it("is defined", function() {
        expect(FormView).to.be.an('function');
    });

    it("is creatable", function() {
        expect(formView).to.be.an('object');
    });

    describe("run", function() {
        before(function() {
            /*
            formView.addSelectOptions("field2", {
                value: "v",
                label: "l",
                selected: "value1",
                list: [{
                    v: "value1",
                    l: "label1"
                }, {
                    v: "value2",
                    l: "label2"
                }]
            });
        */
            formView.run();
        });

        it("is defined", function() {
            expect(formView.run).to.be.an('function');
        });
/*
        it("render select options", function() {
            expect($("#field2").html()).to.be.equal('<option selected="selected" value="value1">label1</option><option value="value2">label2</option>');

        });
*/

        it("register change handler on all input fields kind in tag", function() {
            expect(Object.keys(handlers).length).to.be.equal(4);
            expect(handlers.field1).to.be.a('function');
        });

        it("emit changed event on input changed", function() {
            var _propertyName, _value;
            formView.events.once('changed', function(propertyName, value) {
                _propertyName = propertyName;
                _value = value;
            });
            $("#field1").val(11);

            handlers.field1.apply($("#field1"));

            expect(_propertyName).to.be.equal("field1");
            expect(_value).to.be.equal('11');

        });

        it("emit converted changed event for date input changed", function() {
            var _propertyName, _value;
            formView.events.once('changed', function(propertyName, value) {
                _propertyName = propertyName;
                _value = value;
            });
            $("#fieldDate").val("2013-12-13");

            handlers.fieldDate.apply($("#fieldDate"));

            expect(_propertyName).to.be.equal("fieldDate");
            expect(_value).to.be.equal(1386889200000);

        });


    });

    describe("set", function() {
        it("is defined", function() {
            expect(formView.set).to.be.an('function');
        });

        it("change input field value", function() {
            formView.set("field1", 12);
            expect($("#field1").val()).to.be.equal('12');
        });

        it("change input field value", function() {
            formView.set("fieldDate", 1356994800000);
            expect($("#fieldDate").val()).to.be.equal("2013-01-01");
        });
    });



});

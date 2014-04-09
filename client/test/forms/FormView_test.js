'use strict';

var deps = {
  $: "jquery",
  FormView: "forms/FormView"
};


describe("form-view", function() {
  var $,
    FormView,

    testContent = '<div id="testContent"><div id="div1"><input id="fieldDate" type="date"><input id="fieldBool" type="checkbox"><input id="field1"><select id="field2"></select><textarea id="field3"></textarea></div>' +
      '<div id="div2"><input id="field1A"><select id="field2B"></select><textarea id="field3C"></textarea></div></div>';

  before(amdMocha.require(deps, function(mods) {
    $ = mods.$;
    FormView = mods.FormView;
  }));
/*
  describe('change event', function() {
    var formView,
      handlers = {},
      originalChange;

    before(function() {
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
      formView.run();
    });

    after(function() {
      var $a = $("a");
      $a.__proto__.change = originalChange;
      $("#testContent").remove();
    });

    it("is defined", function() {
      expect(FormView).to.be.an('function');
    });

    it("is creatable", function() {
      expect(formView).to.be.an('object');
    });


    it("register change handler on all input fields kind in tag", function() {
      expect(Object.keys(handlers).length).to.be.equal(5);
      expect(handlers.field1).to.be.a('function');
    });

  });
*/
  describe("run", function() {
    var form;

    before(function() {
      $("body").append(testContent);
      form = new FormView("#testContent #div1");
      form.run();
    });


    it("is defined", function() {
      expect(form.run).to.be.an('function');
    });

    it("emit changed event on input changed", function(done) {
      form.events.once('changed', function(propertyName, value) {
        expect(propertyName).to.be.equal("field1");
        expect(value).to.be.equal('11');
        done();
      });



      $("#field1").val(11).change();


    });

    it("emit converted changed event for date input changed", function(done) {
      form.events.once('changed', function(propertyName, value) {
        expect(propertyName).to.be.equal("fieldDate");
        expect(value).to.be.equal(1386889200000);
        done();
      });

      $("#fieldDate").val("2013-12-13").change();


    });

    it("emit converted changed event for checkbox input changed", function(done) {

      form.events.once('changed', function(propertyName, value) {

        expect(propertyName).to.be.equal("fieldBool");
        expect(value).to.be.equal(true);
        done();
      });
      $("#fieldBool").prop("checked",true).change();


    });

    after(function() {

      $("#testContent").remove();
    });

    describe("set", function() {

      it("is defined", function() {
        expect(form.set).to.be.an('function');
      });

      it("change input field value", function() {
        form.set("field1", 12);
        expect($("#field1").val()).to.be.equal('12');
      });

      it("change input field value", function() {
        form.set("fieldDate", 1356994800000);
        expect($("#fieldDate").val()).to.be.equal("2013-01-01");
      });
    });

  });


});

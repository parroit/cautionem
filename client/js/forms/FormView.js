define(["jquery", "moment", "eventEmitter"], function($, moment, EventEmitter) {
console.dir(moment)

    function FormView(rootSelector) {
        this.events = new EventEmitter();
        this.rootSelector = rootSelector;
    }

    FormView.prototype.run = function() {
        var _this = this;
        this.rootElement = $(this.rootSelector);
        
        var elms = this.rootElement.find("input[type!=date], select, textarea");
        elms.change(function() {
            var elm = $(this);
            if (elm.attr("type")=="checkbox") {
                _this.events.emit('changed', elm.attr("id"), elm.prop("checked") && true || false);
            } else {
                _this.events.emit('changed', elm.attr("id"), elm.val());
            }
            
        });

        elms = this.rootElement.find("input[type=date]");
        elms.change(function() {
            var elm = $(this);
            var dateVal = moment(elm.val()).valueOf();
            
            _this.events.emit('changed', elm.attr("id"), dateVal);
        });

    };

    FormView.prototype.set = function(propertyName, value) {
        
        var elm = this.rootElement.find("#" + propertyName);
        if (elm.attr("type") == "date") {
            elm.val(moment(Number(value)).format("YYYY-MM-DD"));
        } else {
            elm.val(value);
        }

    };

    return FormView;
});

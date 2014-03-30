define(["jquery", "moment", "eventEmitter"], function($, moment, EventEmitter) {
console.dir(moment)

    function FormView(rootSelector) {
        this.events = new EventEmitter();
        this.rootSelector = rootSelector;
    }

    FormView.prototype.run = function() {
        var _this = this;
        this.rootElement = $(this.rootSelector);
        
        this.rootElement.find("input[type!=date], select, textarea").change(function() {
            var elm = $(this);
            
            _this.events.emit('changed', elm.attr("id"), elm.val());
        });

        this.rootElement.find("input[type=date]").change(function() {
            var elm = $(this);
            var dateVal = moment(elm.val()).valueOf();
            
            _this.events.emit('changed', elm.attr("id"), dateVal);
        });

    };

    FormView.prototype.set = function(propertyName, value) {
        
        var elm = this.rootElement.find("#" + propertyName);
        if (elm.attr("type") == "date") {
            elm.val(moment(value).format("YYYY-MM-DD"));
        } else {
            elm.val(value);
        }

    };

    return FormView;
});

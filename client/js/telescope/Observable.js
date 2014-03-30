define(["eventEmitter"], function(EventEmitter) {

    function Observable() {

    }



    //noinspection JSAccessibilityCheck
    Observable.prototype.init = function(observed) {
        var _this = this;
        _this.observed = observed;
        for (var property in observed) {
            //noinspection JSUnfilteredForInLoop
            if (! (observed[property] instanceof Array)) {
                //noinspection JSUnfilteredForInLoop
                (function(prop) {
                    Object.defineProperty(_this, prop, {
                        get: function() {
                            return _this._get(prop);
                        },
                        set: function(value) {
                            _this._set(prop, value);
                        },
                        enumerable: true,
                        configurable: false

                    });
                })(property);

            }

        }
        _this.events = new EventEmitter();
    };



    //noinspection JSAccessibilityCheck
    Observable.prototype._set = function(propertyName, value) {
        this.observed[propertyName] = value;
        this.events.emit('changed', propertyName, value)
    };
    Observable.prototype._get = function(propertyName) {
        return this.observed[propertyName];

    };

    return Observable;
});

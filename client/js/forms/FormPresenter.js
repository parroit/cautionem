define([], function() {
    function FormPresenter(observable, view) {
        this.observable = observable;
        this.view = view;
    }

    FormPresenter.prototype.start = function() {
        var _this = this;
        var changing = {};
        _this.view.events.on('changed', function(propertyName, value) {
            if (!changing[propertyName]) {
                changing[propertyName] = true;
                _this.observable[propertyName] = value;
                delete changing[propertyName];
            }
        });

        _this.observable.events.on('changed', function(propertyName, value) {
            if (!changing[propertyName]) {
                _this.view.set(propertyName, value);
            }

        });

    };

    return FormPresenter;
});

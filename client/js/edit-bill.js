define(["jquery"], function($) {
    return {
        start: function() {
            $(function() {
                $("body").append("<h1>Sono qui</h1>");
            });

        }
    };
});

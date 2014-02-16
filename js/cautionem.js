define(["jquery"], function($) {

    return {
        start: function() {
            $("#content").append(
                $("<h1>").html("It work!")
            );
        }
    }

});

describe("cautionem", function() {
    var modules = zrequire("js/cautionem", "jquery");

    it("is defined", function() {
        modules.cautionem.should.be.an("object");
    });

    describe("start", function() {


        it("is defined", function() {
            modules.cautionem.start.should.be.an("function");
        });

        it("alter content", function() {
            var $ = modules.jquery;

            modules.cautionem.start();

            $("#content").html().should.be.equal("<h1>It work!</h1>");
        });
    });


});

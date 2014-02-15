 describe("cautionem", function() {
     var cautionem,$;
     before(function(done) {
         requirejs(["js/cautionem", "chai", "jquery"], function(cautionemModule, chai, jquery) {

             chai.should();

             cautionem = cautionemModule;

             $ = jquery;

             done();
         });
     });

     it("is defined", function() {
         cautionem.should.be.an("object");
     });

     describe("start", function() {
         it("is defined", function() {
             cautionem.start.should.be.an("function");
         });

         it("alter content", function() {
             cautionem.start();

            $("#content").html().should.be.equal("<h1>It work!</h1>");
         });
     });


 });

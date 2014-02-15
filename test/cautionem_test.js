require(['chai','mocha'], function(chai, mocha){
 alert("ciso")
  // Chai
  var should = chai.should();
  
 
  /*globals mocha */
  mocha.setup('bdd');
 
  require([
    'js/app_test.js',
  ], function(cautionem) {
    mocha.run();
  });
 
});
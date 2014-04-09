var phantom = require('phantom'),
  fs = require("fs"),
  util = require("util");

function prepareOptions(name, partials, model) {
  var options = {
    partials: {
      navbar: "navbar",
      dialogs: "dialogs"
    }

  };

  if (model) {
    for (var prop in model) {
      options[prop] = model[prop];
    }

  }

  if (partials && partials.length) {
    partials.forEach(function(partial) {
      options.partials[partial] = partial;
    });
  }

  return options;
}

exports.template = function(name, partials, model) {
  return function(req, res) {
    var options = prepareOptions(name, partials, model);
    options.errors = req.flash("error");
    options.messages = req.flash("info");
    options.user = req.user;
    //console.dir(req.user)
    res.render(name, options);
  };

};


exports.pdf = function(url, req, res) {

  phantom.create(function(ph) {
    ph.createPage(function(page) {
      var pdfPath = '/tmp/ft.pdf',
        fullUrl = req.protocol + '://' + req.get('host') + url;

      console.log(fullUrl)
      page.open(fullUrl, function(status) {
        page.set('paperSize', {
          format: 'A4'
        }, function() {

          page.evaluate(function() {
            return document.title;
          }, function(title) {
            console.log("title:%s", title);
            var pdfPath = '/tmp/ft.pdf';
            
            page.render(pdfPath, function() {
              res.download(pdfPath, util.format('%s.pdf', title.replace("/", "_")), function(err) {
                if (err) {
                  res.emit("error", err)
                } else {
                  fs.unlink(pdfPath);
                }
              });

              ph.exit();

            });
          });


        });

      });
    });
  });


};

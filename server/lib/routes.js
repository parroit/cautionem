var fs = require("fs");

exports.template = function(name, partials) {
	var options = {
		partials: {
			navbar: "navbar",
			dialogs: "dialogs"
		}

	};

	if (partials && partials.length) {
		partials.forEach(function(partial) {
			options.partials[partial] = partial;
		});
	}

	return function(req, res) {
		
		options.errors = req.flash("error");
		options.messages = req.flash("info");
		options.user = req.user;
		//console.dir(req.user)
		res.render(name, options);
	};

};
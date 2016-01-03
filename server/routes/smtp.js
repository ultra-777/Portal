'use strict';

module.exports = function(app) {
	// Root routing
	var smtp = require('../controllers/smtp');
	app.route('/__/send').post(smtp.send);
};
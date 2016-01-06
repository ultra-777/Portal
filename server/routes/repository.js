'use strict';

module.exports = function(app) {
	// Root routing
	var update = require('../controllers/update');
	app.route('/update/pull').post(update.pull);
	app.route('/update/install').post(update.install);
	app.route('/update/build').post(update.build);
	app.route('/update/restart').post(update.restart);

};
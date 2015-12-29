'use strict';

module.exports = function(app) {
	// Root routing
	var admin = require('../controllers/admin');
	app.route('/admin/pull').post(admin.pull);
	app.route('/admin/install').post(admin.install);
	app.route('/admin/build').post(admin.build);
	app.route('/admin/restart').post(admin.restart);
    app.route('/admin/reboot').post(admin.reboot);

};
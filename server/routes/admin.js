'use strict';

module.exports = function(app) {
	// Root routing
	var admin = require('../controllers/admin');
    app.route('/admin/reboot').post(admin.reboot);

};
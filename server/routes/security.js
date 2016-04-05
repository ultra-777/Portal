'use strict';

/**
 * Module dependencies.
 */
var passport = require('passport');

module.exports = function(app) {
	// User Routes
	var security = require('../controllers/security');
	app.route('/security/getSessionInfo').post(security.getSessionInfo);
	app.route('/security').put(security.update);
	//app.route('/security/password').post(security.changePassword);
	//app.route('/security/accounts').delete(security.removeOAuthProvider);

	// Setting up the users api
	app.route('/security/signup').post(security.signup);
	app.route('/security/signin').post(security.signin);
	app.route('/security/signout').post(security.signout);

	// Finish by binding the user middleware
	app.param('userId', security.userByID);
};
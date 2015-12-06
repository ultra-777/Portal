'use strict';

var passport = require('passport'),
	db = require('../models/storage/db'),
	path = require('path'),
	config = require('./config');

module.exports = function() {
	// Serialize sessions
	passport.serializeUser(function(user, done) {
		done(null, user.id);
	});

	// Deserialize sessions
	passport.deserializeUser(function(req, id, done) {

		var session = req.session;

		var accountScheme = db.getObject('account', 'security');
		var roleScheme = db.getObject('role', 'security');
		accountScheme
			.find(
			{
				where: { id: id },
				include: [{ model: roleScheme, as: 'roles' }]
			})
			.then(function(user){
				user.password = undefined;
				user.salt = undefined;
				done(null, user);
			})
			.catch(function(err){
				done(err, null);
			});

	});

	// Initialize strategies
	var strategies = config.getGlobbedFiles('./server/config/strategies/**/*.js');
    strategies.forEach(function(strategy) {
		require(path.resolve(strategy))();
	});
};
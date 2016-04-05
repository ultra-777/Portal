'use strict';

/**
 * Module dependencies.
 */

var passport = require('passport'),
	LocalStrategy = require('passport-local').Strategy,
	db = require('../../models/storage/db');

module.exports = function() {
	// Use local strategy
	passport.use(new LocalStrategy({
			usernameField: 'login',
			passwordField: 'password'
		},
		function(login, password, done) {

			var user = db.getObject('account', 'security');
			var role = db.getObject('role', 'security');
			// console.log('-- strategies/local finding user: ' + login);
			user.find(
				{
					where: { name: login },
					include: [{ model: role, as: 'roles' }]
				})
				.then(function(user){
					if (!user){
						return done(null, false, { message: 'Unknown user'} );
					}
					if (!user.authenticate(password)) {
						return done(null, false, {
							message: 'Invalid password'
						});
					}

					return done(null, user);
				})
				.catch(function(err) {
					console.log(err);
					return done(err);
				});
		}
	));
};
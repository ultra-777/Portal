'use strict';

module.exports = function(app) {
	// Root routing
	var repository = require('../controllers/repository');
	app.route('/repository/find').post(repository.find);
	app.route('/repository/get').post(repository.get);
	app.route('/repository/update').post(repository.update);
	app.route('/repository/create').post(repository.create);
	app.route('/repository/delete').post(repository.delete);
};
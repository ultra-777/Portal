'use strict';
/**
 * Module dependencies.
 */

 process.env.NODE_ENV = 'development'

//var cluster = require('cluster');
var init = require('./server/config/init')();
var config = require('./server/config/config');
var db = require('./server/models/storage/db');



db
	.initAndSynq(config.db)
	.then(function() {
		var toString = require('./server/common/stringify');


		// Init the express application
		var app = require('./server/config/express')();

		// Bootstrap passport config
		require('./server/config/passport')();


		var http = require('http');
		var server = http.createServer(app);



		var socket = require('./server/routes/socket.js');
		var io = require('socket.io').listen(server);
		//var redis = require('socket.io-redis');
		//io.adapter(redis({ host: 'localhost', port: 6379 }));

		io.sockets.on('connection', socket);

		if (config.host){
			server.listen(config.port, config.host, function(){
				console.log("Express server listening on host: " + config.host + " port: " + config.port);
			});
		}
		else {
			server.listen(config.port, function () {
				console.log("Express server listening on port " + config.port);
			});
		}


		// Logging initialization
		console.log('-- node (' + process.pid + ') started on port ' + config.port);



	});


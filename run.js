'use strict';
/**
 * Module dependencies.
 */

// process.env.NODE_ENV = 'production'

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

		/*
		try {
			var fs = require('fs');
			var https = require('https');
			var options = {
				key: fs.readFileSync(config.sslKeyFilePath),
				cert: fs.readFileSync(config.sslCertificateFilePath)
			};
			var serverSsl = https.createServer(options, app).listen(config.portSsl, function () {
				console.log("Express server listening on port " + config.portSsl);
			});
			console.log("SSL is supported");
		}
		catch(err){
			console.error("SSL is not supported: " + err);
		}
		*/

		// Logging initialization
		console.log('-- node (' + process.pid + ') started on port ' + config.port);



		});









/*
if (process.env.NODE_ENV === 'production') {
	console.log = function(){};
}
*/

/*
cluster.schedulingPolicy = cluster.SCHED_RR;
var stateTracker = function (period, deviationRate, callback) {

	var initialValue = null;
	var history = new Object();

	this.addValue = function(newValue) {

		if (!initialValue)
			initialValue = newValue;

		var currentMoment = (new Date()).getTime();
		history[currentMoment] = newValue;
		var lastSuitableMoment = currentMoment - period;

		var currentValue = null;
		var minValue = null;
		for (var dt in history) {
			var moment = Number(dt);
			if (moment < lastSuitableMoment){
				delete history[dt]
				continue;
			}

			currentValue = history[dt];
			if (minValue){
				if (minValue > currentValue)
					minValue = currentValue;
			}
			else
				minValue = currentValue;
		}

		if (minValue && initialValue && deviationRate && callback){
			var borderValue = initialValue * deviationRate;
			if (borderValue < minValue)
				callback(minValue);
		}
	}
};


if (cluster.isMaster) {
	db
		.initAndSynq(config.db)
		.then(function() {
			var toString = require('./server/common/stringify');
			var subscribeChild = function (child) {
				child.on('message', function (msg) {
					if (msg.broadcast) {
						console.log('-- broadcast message from child (%d): %s', child.process.pid, toString(msg));

						Object.keys(cluster.workers).forEach(function (id) {
							if (id != child.id) {
								cluster.workers[id].send(msg);
							}
						});
					}
				});
			};

			var debug = process.execArgv.indexOf('--debug') !== -1;
			cluster.setupMaster({
				execArgv: process.execArgv.filter(function (s) {
					return s !== '--debug'
				})
			});


			// Count the machine's CPUs
			var cpuCount = require('os').cpus().length;

			var config = require('./server/config/config');
			if (cpuCount < config.minNodesCount)
				cpuCount = config.minNodesCount;
			if (config.maxNodesCount)
				cpuCount = config.maxNodesCount;

			console.log('-- CPU count: ' + cpuCount);
			console.log('-- Master started: ' + process.pid);

			// Create a worker for each CPU
			var debugPort = 5859;
			var portIndex = debugPort;

			var recoverNodes = function(urgent){
				var currentNodesCount =
					Object.keys(cluster.workers).length ?
						Object.keys(cluster.workers).length
						: 0;
				var requiredAmount = cpuCount - currentNodesCount;
				var launchTimeout = (urgent || (currentNodesCount === 0)) ? 0 : config.workerLaunchSpread;
                console.log('--Current nodes count: %d', currentNodesCount);
				for (var i = 0; i < requiredAmount; i += 1) {
					setTimeout(function () {
						if (debug) {
							if (portIndex > (debugPort + (10 * cpuCount)))
								portIndex = debugPort;
							cluster.settings.execArgv.push('--debug=' + (++portIndex));
						}
						subscribeChild(cluster.fork());
						if (debug)
							cluster.settings.execArgv.pop();
					}, i * launchTimeout)
				}
			}


			cluster.on('online', function (worker) {
				console.log('--worker %s online', worker.id);
			});
			cluster.on('listening', function (worker, addr) {
				console.log('--worker %s listening on %s:%s:%d', worker.id, addr.addressType, addr.address, addr.port);
			});
			cluster.on('disconnect', function (worker) {
                console.log('--worker %s disconnected on %s:%d', worker.id);
 //               recoverNodes(true);
			});

			recoverNodes(false);

			cluster.on('exit', function (worker, code, signal) {
				if (signal) {
					console.log('Worker died with signal (ID: %d, PID: %d)', worker.id, worker.process.pid);
  //                  recoverNodes(true);
				}
				else if (code) {
					console.log('Worker died (ID: %d, PID: %d, code: %d)', worker.id, worker.process.pid, code);
  //  				recoverNodes(true);
				}
			});
		})
		.catch(function(err){
			console.log('Sequelize init failed: ' + err);
		});


// Code to run if we're in a worker process
} else {

	db.init(config.db);

	// Init the express application
	var app = require('./server/config/express')();

	// Bootstrap passport config
	require('./server/config/passport')();



	var stateTracker =
		new stateTracker(
			config.workerStatePeriod,
			config.workerStateOverheadRatio,
			function(theValue){
		//process.disconnect();
				process.exit(0);
	});
	stateTracker.addValue(process.memoryUsage().rss);

	// Start the app by listening on <port>
	//app.listen(config.port);


	var http = require('http');
    var server = http.createServer(app);



    var socket = require('./server/routes/socket.js');
    var io = require('socket.io').listen(server);
    //var redis = require('socket.io-redis');
    //io.adapter(redis({ host: 'localhost', port: 6379 }));

    io.sockets.on('connection', socket);




    server.listen(config.port, function(){
		console.log("Express server listening on port " + config.port);
	});

	try {
		var fs = require('fs');
		var https = require('https');
		var options = {
			key: fs.readFileSync(config.sslKeyFilePath),
			cert: fs.readFileSync(config.sslCertificateFilePath)
		};
		var serverSsl = https.createServer(options, app).listen(config.portSsl, function () {
			console.log("Express server listening on port " + config.portSsl);
		});
		console.log("SSL is supported");
	}
	catch(err){
		console.error("SSL is not supported: " + err);
	}


	setInterval(function(){
		stateTracker.addValue(process.memoryUsage().rss);
	}, config.workerStateCheckTimeout);

	// Logging initialization
	console.log('-- node (' + process.pid + ') started on port ' + config.port);

}
*/

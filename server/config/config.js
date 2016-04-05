'use strict';

/**
 * Module dependencies.
 */
var _ = require('lodash'),
	glob = require('glob');

var sortFunction = function(a, b) {
	var value = 0;
	if (a && b) {
		var aValue = a.endsWith('.module.js') ? 1 : 0;
		var bValue = b.endsWith('.module.js') ? 1 : 0;
		if (aValue != bValue)
			value = (aValue > bValue) ? -1 : 1;
		else
			value = a.localeCompare(b);
	}
	return value;
};

/**
 * Load app configurations
 */
module.exports = _.extend(
	require('./env/all'),
	require('./env/' + process.env.NODE_ENV) || {}
);

/**
 * Get leafs by glob patterns
 */
module.exports.getGlobbedFiles = function(globPatterns, removeRoot) {
	// For context switching
	var _this = this;

	// URL paths regex
	var urlRegex = new RegExp('^(?:[a-z]+:)?//', 'i');

	// The output array
	var output = [];


	// If glob pattern is array so we use each pattern in a recursive way, otherwise we use glob 
	if (_.isArray(globPatterns)) {
		globPatterns.forEach(function(globPattern) {
			var localResult = _this.getGlobbedFiles(globPattern, removeRoot);
			localResult.sort(sortFunction);
			output = _.union(output, localResult);
		});
	} else if (_.isString(globPatterns)) {
		if (urlRegex.test(globPatterns)) {
			output.push(globPatterns);
		} else {
			var files = glob(globPatterns, {
				sync: true
			});

            if (removeRoot) {
				var localResult = files.map(function(file) {
                    return file.replace(removeRoot, '');
                });
				localResult.sort(sortFunction);
				files = localResult;
            }

            output = _.union(output, files);

		}
	}

	return output;
};

/**
 * Get the modules JavaScript leafs
 */
module.exports.getJavaScriptAssets = function(includeTests) {
	var output = this.getGlobbedFiles(this.assets.lib.js.concat(this.assets.js), 'client/');
	return output;
};

/**
 * Get the modules CSS leafs
 */
module.exports.getCSSAssets = function() {
	var output = this.getGlobbedFiles(this.assets.lib.css.concat(this.assets.css), 'client/');
	return output;
};
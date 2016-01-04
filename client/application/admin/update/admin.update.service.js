'use strict';

//Menu service used for managing  menus
angular
	.module('update')
	.service('adminUpdateService', [
		'commonMvcServiceImpl',
	function(data) {

		this.getAccountInfo = function () {
			return data.httpRequest(
					'POST',
					'security/getAccountInfo',
					null);
		};

		this.pull = function () {
			return data.httpRequest(
					'POST',
					'update/pull',
					null);
		};

		this.install = function () {
			return data.httpRequest(
					'POST',
					'update/install',
					null);
		};

		this.build = function () {
			return data.httpRequest(
					'POST',
					'update/build',
					null);
		};

		this.restart = function () {
			return data.httpRequest(
					'POST',
					'update/restart',
					null);
		};

		this.reboot = function () {
			return data.httpRequest(
					'POST',
					'update/reboot',
					null);
		};
	}
]);
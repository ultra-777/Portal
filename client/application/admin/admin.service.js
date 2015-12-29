'use strict';

//Menu service used for managing  menus
angular
	.module('admin')
	.service('adminService', [
		'dataServiceImpl',
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
					'admin/pull',
					null);
		};

		this.install = function () {
			return data.httpRequest(
					'POST',
					'admin/install',
					null);
		};

		this.build = function () {
			return data.httpRequest(
					'POST',
					'admin/build',
					null);
		};

		this.restart = function () {
			return data.httpRequest(
					'POST',
					'admin/restart',
					null);
		};

		this.reboot = function () {
			return data.httpRequest(
					'POST',
					'admin/reboot',
					null);
		};
	}
]);
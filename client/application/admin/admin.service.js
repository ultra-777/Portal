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
	}
]);
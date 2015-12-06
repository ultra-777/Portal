'use strict';

//Menu service used for managing  menus
angular
	.module('header')
	.service('headerService', [
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
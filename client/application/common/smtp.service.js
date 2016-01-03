'use strict';

//Menu service used for managing  menus
angular
	.module('header')
	.service('headerService', [
		'mvcServiceImpl',
	function(mvc) {

		this.getAccountInfo = function () {
			return mvc.httpRequest(
					'POST',
					'security/getAccountInfo',
					null);
		};
	}
]);
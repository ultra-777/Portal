'use strict';

//Menu service used for managing  menus
angular
	.module('header')
	.service('headerService', [
		'commonMvcServiceImpl',
	function(mvc) {

		this.getAccountInfo = function () {
			return mvc.httpRequest(
					'POST',
					'security/getAccountInfo',
					null);
		};
	}
]);
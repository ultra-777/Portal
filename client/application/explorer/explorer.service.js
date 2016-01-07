'use strict';

//Menu service used for managing  menus
angular
	.module('explorer')
	.service('explorerService', [
		'commonMvcServiceImpl',
	function(data) {

		this.getAccountInfo = function () {
			return data.httpRequest(
					'POST',
					'security/getAccountInfo',
					null);
		};

	}
]);
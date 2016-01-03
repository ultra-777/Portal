'use strict';

//Menu service used for managing  menus
angular
	.module('common')
	.service('commonSmtpService', [
		'commonMvcServiceImpl',
	function(mvc) {

		this.send = function (mail) {
			return mvc.httpRequest(
				'POST',
				'__/send',
				{
					mail: mail
				}
			);
		};
	}
]);
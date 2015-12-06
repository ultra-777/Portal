'use strict';

//Menu service used for managing  menus
angular
	.module('header')
	.service('authenticationService', [
		'$rootScope',
		'$window',
		'$state',
		'$q',
		'dataServiceImpl',
		'headerMenuService',
	function(rootScope, window, state, q, data, headerMenu) {

		var vm = this;
		vm.signin = signin;
		vm.signout = signout;
		vm.signup = signup;

		function signin(login, password) {
			var defer = q.defer();
				data.httpRequest(
					'POST',
					'/security/signin',
					{
						username: login,
						password: password
					}
				)
				.then(function(response) {
					//If successful we assign the response to the global user model
					//window.sessionStorage.account = JSON.stringify(response);

					continueAfterLogin();

					defer.resolve();
				}, function (err){
					defer.reject(err);
				});
			return defer.promise;
		};

		function signout() {
			var defer = q.defer();
			data.httpRequest(
				'POST',
				'/security/signout',
				null
			).then(function(response) {
				//window.sessionStorage.account = '';
				state.go('home');
				headerMenu.reload();
				defer.resolve();
			}, function(err) {
				defer.reject(err);
			});
			return defer.promise;
		};

		function signup(firstName, lastName, email, username, password) {
			var defer = q.defer();
			data.httpRequest(
					'POST',
					'/security/signup',
					{
						firstName: firstName,
						lastName: lastName,
						email: email,
						username: username,
						password: password
					}
			)
			.then(function(response) {
				//If successful we assign the response to the global user model
				//window.sessionStorage.account = JSON.stringify(response);

				continueAfterLogin();

				defer.resolve();
			}, function (err){
				defer.reject(err);
			});
			return defer.promise;
		};

		function continueAfterLogin(){
			var history = rootScope.signinHistory;
			if (history){
				var toState = history.toState;
				var toParams = history.toParams;
				delete rootScope.signinHistory;
				state.go(toState.name, toParams);
			}
			else {
				state.go('home');
			}
			headerMenu.reload();
		}
	}
]);
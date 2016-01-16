'use strict';

//Menu service used for managing  menus
angular
	.module('header')
	.service('authenticationService', [
		'$rootScope',
		'$window',
		'$state',
		'$q',
		'commonMvcServiceImpl',
		'headerMenuService',
	function(rootScope, window, state, q, data, headerMenu) {

		var vm = this;
		vm.signin = signin;
		vm.signout = signout;
		vm.signup = signup;
		vm.getAccount = null;

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
					// window.sessionStorage.account = JSON.stringify(response);
					rootScope.account = response;

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
				// window.sessionStorage.account = '';
				rootScope.account = null;
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
				rootScope.account = response;
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

		function initialize(){
			var defer = q.defer();
			function getAccount(){
				return rootScope.account;
			}
			data.httpRequest(
				'POST',
				'/security/getAccountInfo',
				null
			).then(function(accountInfo) {
				rootScope.account = accountInfo.account;
				headerMenu.reload();
				defer.resolve(getAccount());
			}, function(err) {
				defer.reject(err);
			});
			vm.getAccount = function(){
				return defer.promise;
			}
		}

		initialize();
	}
]);
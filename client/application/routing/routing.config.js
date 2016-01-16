'use strict';

// Setting up route
angular
    .module('routing')
    .config([
        '$stateProvider',
        '$urlRouterProvider',
	function (stateProvider, urlRouterProvider) {
	    // Redirect to home view when route not found
	    urlRouterProvider.otherwise('home');

	    // Home state routing
	    stateProvider.
		    state('home', {
		        url: '/home',
				data: {
					'noLogin': true
				},
		        views: {
		            main: {
		                templateUrl: '/application/home/home.view.html',
						controller: 'homeController as vm'
						// templateUrl: '/application/explorer/explorer.view.html',
						// controller: 'explorerController as vm'
		            }
		        }
		    });

		stateProvider.
			state('admin', {
				url: '/admin',
				views: {
					main: {
						templateUrl: '/application/admin/admin.view.html',
						controller: 'adminController as vm'
					}
				}
			});

		stateProvider.
			state('admin-update', {
				url: '/admin-update',
				views: {
					main: {
						templateUrl: '/application/admin/update/admin.update.view.html',
						controller: 'adminUpdateController as vm'
					}
				}
			});

		stateProvider.
			state('admin-repository', {
				url: '/admin-repository',
				views: {
					main: {
						templateUrl: '/application/admin/repository/admin.repository.view.html',
						controller: 'adminRepositoryController as vm'
					}
				}
			});

	    // Default state routing
	    stateProvider.
		    state('signin', {
		        url: '/signin',
		        data: {
		            'noLogin': true
		        },
		        views: {
		            main: {
                        templateUrl: '/application/authentication/authentication.signin.view.html',
						controller: 'authenticationSigninController as vm'
		            }
		        }
            });

		stateProvider.
			state('signout', {
				url: '/signout',
				data: {
					'noLogin': true
				}
			});

		stateProvider.
		state('signup', {
			url: '/signup',
			data: {
				'noLogin': true
			},
			views: {
				main: {
					templateUrl: '/application/authentication/authentication.signup.view.html',
					controller: 'authenticationSignupController as vm'
				}
			}
		});

		stateProvider.
		state('explorer', {
			url: '/explorer',
			data: {
				'noLogin': false
			},
			views: {
				main: {
					templateUrl: '/application/explorer/explorer.view.html',
					controller: 'explorerController as vm'
				}
			}
		});
	}]);
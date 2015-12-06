'use strict';

angular
    .module('header')
    .controller('headerController', [
        '$scope',
        '$state',
        '$rootScope',
        '$timeout',
        'headerService',
        'headerMenuService',
	function(scope, state, rootScope, timeout, headerService, headerMenu) {

        var vm = this;

        function initializeMenu(){
            vm.root = headerMenu.menu;
        }

        function initialize(){

            initializeMenu();

            headerService
                .getAccountInfo()
                .then(function(result){
                    vm.account = result;
                    //initializeMenu();
                }, function(err){
                    var q = 99;
                });

        }

        initialize();

        /*
        scope.currentTime = null;
		scope.authentication = Authentication;
		scope.isCollapsed = false;
		scope.menu = Menus.getMenu('topbar');


		scope.toggleCollapsibleMenu = function() {
			scope.isCollapsed = !scope.isCollapsed;
		};

		// Collapsing the menu after navigation
		scope.$on('$stateChangeSuccess', function() {
			scope.isCollapsed = false;
		});

        function getUserInfo() {
            dataService
                .getUserInfo()
                    .then(function(data) {
                        if (data.ip)
                            data.ip = data.ip.replace('::ffff:', '');
                        scope.userInfo = data;
                    },
                    function (error) {
                        console.log(error);
                    });
        };

        getUserInfo();
        */
    }


]);
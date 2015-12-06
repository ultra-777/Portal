'use strict';

angular
    .module('home')
    .controller('homeController', [
        '$scope',
        '$rootScope',
        '$timeout',
        'headerService',
	function(scope, rootScope, timeout, headerService) {

        var vm = this;

        function initialize() {
            vm.data = 'home data';
        }

        initialize();

    }

]);
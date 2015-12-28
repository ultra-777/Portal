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
        vm.currentTime = null;
        vm.currentTimeLine = null;

        function trackTime() {
            vm.currentTime = new Date();
            vm.currentTimeLine = vm.currentTime.toLocaleString();
            timeout(trackTime, 1000);
        };

        function initialize() {
            vm.data = 'home data';
            trackTime();
        }

        initialize();

    }

]);
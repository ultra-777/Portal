'use strict';

angular
    .module('home')
    .controller('homeController', [
        '$scope',
        '$rootScope',
        '$timeout',
        'headerService',
        'commonMessageBoxService',
	function(scope, rootScope, timeout, headerService, messageBox) {

        var vm = this;
        vm.currentTime = null;
        vm.currentTimeLine = null;
        vm.showMessage = showMessage;

        function trackTime() {
            vm.currentTime = new Date();
            vm.currentTimeLine = vm.currentTime.toLocaleString();
            timeout(trackTime, 1000);
        };

        function showMessage(){
            messageBox.show('message', 'title');
        }

        function initialize() {
            vm.data = 'home data';
            trackTime();
        }

        initialize();

    }

]);
'use strict';

angular
    .module('explorer')
    .controller('explorerController', [
        '$scope',
        '$rootScope',
        '$timeout',
        '$location',
        '$window',
        'adminService',
function (scope, rootScope, timeout, location, window, adminService) {

    var vm = this;

    function initialize(){
    }

    initialize();

}]);
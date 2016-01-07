'use strict';

angular
    .module('admin')
    .controller('adminController', [
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
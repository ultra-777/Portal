'use strict';

angular
    .module('admin')
    .controller('adminController', [
        '$scope',
        '$rootScope',
        '$timeout',
        '$location',
        '$window',
        'dataServiceImpl',
function (scope, rootScope, timeout, location, window, dataService) {

    var vm = this;
    vm.data = 'admin data';

}]);
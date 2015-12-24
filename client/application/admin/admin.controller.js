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
function (scope, rootScope, timeout, location, window, dataService) {

    var vm = this;
    vm.data = 'admin data';
    vm.account = null;

    function initialize(){


        dataService
            .getAccountInfo()
            .then(function(result){
                vm.account = result;
                var prefix = '::ffff:';
                var ipCandidate = (result.ip) ? result.ip.toString() : '';
                var ip = ((ipCandidate.indexOf(prefix) > -1) ? ipCandidate.substring(prefix.length, ipCandidate.length) : ipCandidate);
                if (ip)
                    vm.account.ip = ip;
                //initializeMenu();
            }, function(err){
                var q = 99;
            });

    }

    initialize();

}]);
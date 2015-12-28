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
    vm.data = 'admin data';
    vm.account = null;
    vm.result = null;
    vm.reboot = reboot;

    function reboot(){
        vm.result = null;
        adminService
            .reboot()
            .then(function(result){
                    vm.result = result;
                },
            function(err){
                vm.result = err;
            });
    }

    function initialize(){


        adminService
            .getAccountInfo()
            .then(function(result){
                vm.account = result;
                var prefix = '::ffff:';
                var ipCandidate = (result.ip) ? result.ip.toString() : '';
                var ip = ((ipCandidate.indexOf(prefix) > -1) ? ipCandidate.substring(prefix.length, ipCandidate.length) : ipCandidate);
                if (ip)
                    vm.account.ip = ip;
                if (result.host)
                    vm.account.host = result.host;
                //initializeMenu();
            }, function(err){
                var q = 99;
            });

    }

    initialize();

}]);
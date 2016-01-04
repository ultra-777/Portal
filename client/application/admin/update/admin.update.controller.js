'use strict';

angular
    .module('update')
    .controller('adminUpdateController', [
        '$scope',
        '$rootScope',
        '$timeout',
        '$location',
        '$window',
        'adminUpdateService',
function (scope, rootScope, timeout, location, window, adminService) {

    var vm = this;
    vm.data = 'admin data';
    vm.account = null;
    vm.result = null;
    vm.pull = pull;
    vm.install = install;
    vm.build = build;
    vm.restart = restart;
    vm.isOperating = false;

    function pull(){
        vm.isOperating = true;
        vm.result = null;
        adminService
            .pull()
            .then(function(result){
                    vm.result = result;
                    vm.isOperating = false;
                },
                function(err){
                    vm.result = err;
                    vm.isOperating = false;
                });
    }

    function install(){
        vm.isOperating = true;
        vm.result = null;
        adminService
            .install()
            .then(function(result){
                    vm.result = result;
                    vm.isOperating = false;
                },
                function(err){
                    vm.result = err;
                    vm.isOperating = false;
                });
    }

    function build(){
        vm.isOperating = true;
        vm.result = null;
        adminService
            .build()
            .then(function(result){
                    vm.result = result;
                    vm.isOperating = false;
                },
                function(err){
                    vm.result = err;
                    vm.isOperating = false;
                });
    }

    function restart(){
        vm.isOperating = true;
        vm.result = null;
        adminService
            .restart()
            .then(function(result){
                    vm.result = result;
                    vm.isOperating = false;
                },
                function(err){
                    vm.result = err;
                    vm.isOperating = false;
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
            }, function(err){
                var q = 99;
            });

    }

    initialize();

}]);
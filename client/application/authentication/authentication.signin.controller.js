'use strict';

angular
    .module('authentication')
    .controller('authenticationSigninController', [
        '$scope',
        '$rootScope',
        '$timeout',
        '$location',
        '$window',
        '$state',
        'headerMenuService',
        'authenticationService',
function (scope, rootScope, timeout, location, window, state, headerMenu, authentication) {

    var vm = this;
    vm.login = null;
    vm.password = null;
    vm.signin = signin;
    vm.error = null;


    function signin() {
        authentication.signin(vm.login, vm.password).then(function(result){
            var q = 0;
        }, function(err){
            vm.error = err;
        });
    };

}]);
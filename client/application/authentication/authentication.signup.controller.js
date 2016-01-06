'use strict';

angular
    .module('authentication')
    .controller('authenticationSignupController', [
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
    vm.firstName = null;
    vm.lastName = null;
    vm.email = null;
    vm.username = null;
    vm.password = null;
    vm.signup = signin;
    vm.error = null;


    function signin() {
        authentication
            .signup(
                vm.firstName,
                vm.lastName,
                vm.email,
                vm.username,
                vm.password)
            .then(function(result){
            var q = 0;
        }, function(err){
            vm.error = err;
        });
    };

}]);
'use strict';

angular
    .module('routing')
    .run([
        '$rootScope',
        '$window',
        '$state',
        'authenticationService',
        function(rootScope, window, state, authentication){

        rootScope.$on('$stateChangeStart',
            function (event, toState, toParams, fromState, fromParams) {

                if (toState.data != undefined) {
                    if (toState.data.noLogin != undefined && toState.data.noLogin) {
                        // какие-то действия перед входом без авторизации
                    }
                    if (toState && toState.name == 'signout'){
                        event.preventDefault();
                        authentication.signout();
                        state.go('home');
                    }
                } else {
                    if (window.sessionStorage.account) {
                        rootScope.account = account;
                    } else {
                        var history = rootScope.signinHistory;
                        if (!history){
                            history = {};
                            rootScope.signinHistory = history;
                        }

                        history.toState = toState;
                        history.toParams = toParams;

                        event.preventDefault();
                        state.go('signin');
                    }
                }
            }
        );
    }]);

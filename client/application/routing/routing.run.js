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

                authentication.getAccount()
                    .then(function(account){

                        if (toState && toState.name == 'signout'){
                            event.preventDefault();
                            authentication.signout();
                            state.go('home');
                        }

                        if (toState.data && toState.data.noLogin) {
                                // какие-то действия перед входом без авторизации
                        } else {
                            if (account) {
                                //
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

                    }, function(error){
                        console.log('routing.error: ' + error);
                    });
            }
        );
    }]);

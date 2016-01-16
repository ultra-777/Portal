'use strict';

angular
    .module('explorer')
    .controller('explorerController', [
        '$scope',
        '$rootScope',
        '$timeout',
        '$location',
        '$window',
        '$q',
        'commonMessageBoxService',
        'explorerService',
function (scope, rootScope, timeout, location, window, q, messageBox, explorerService) {

    var vm = this;



    vm.onSelectedFolderChanged = function(id){
        vm.currentNodeId = id;
    };

    function initialize(){
        var defer = q.defer();
        explorerService.getData()
            .then(function (data) {
                    defer.resolve(data);
                },
                function (error) {
                    defer.resolve(null);
                    messageBox.show(
                        error,
                        'exception'
                    );
                }
            );
        vm.nodePromise = defer.promise;
    }

    initialize();

}]);
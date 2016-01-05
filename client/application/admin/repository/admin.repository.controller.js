'use strict';

angular
    .module('admin-repository')
    .controller('adminRepositoryController', [
        '$scope',
        '$rootScope',
        '$timeout',
        '$location',
        '$window',
        'adminRepositoryService',
function (scope, rootScope, timeout, location, window, data) {

    var vm = this;
    vm.onItem = onItem;
    vm.repository = null;
    vm.repositories = [];

    function onItem(item){
        var toSelect = !item.isSelected;
        var targetRepository = null;
        angular.forEach(vm.repositories, function(repository, key){
            if (toSelect) {
                var isSelected = (item.id == repository.id);
                repository.isSelected = isSelected;
                if (isSelected)
                    targetRepository = repository;
            }
            else
                repository.isSelected = false;
        });
        if (vm.repository && vm.repository !== targetRepository)
            vm.repository.cancel();
        vm.repository = targetRepository;
    }

    function initialize(){

        data.getRepositories()
            .then(
                function(result){
                    vm.repositories = result;
                },
                function(err){

                }
            );
    }

    initialize();

}]);
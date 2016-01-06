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
    vm.add = addNew;
    vm.onNewRepository = onNewRepository;
    vm.remove = onRemove;

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

    function addNew(){
        vm.repository = data.initNewRepository(vm.onNewRepository);
    }

    function onNewRepository(instance) {
        vm.repositories.push(instance);
        onItem(instance);
    }

    function onRemove(id){
        if (id) {
            data.removeRepository(id)
                .then(
                    function (result) {
                        if (result){
                            for (var i =0; i < vm.repositories.length; i++)
                                if (vm.repositories[i].id == id) {
                                    vm.repositories.splice(i, 1);
                                    vm.repository = null;
                                    break;
                                }
                        }
                    },
                    function (err) {
                        var q = 0;
                    }
                );
        }
    }

    function initialize(){

        data.findRepositories()
            .then(
                function(result){
                    vm.repositories = result;
                },
                function(err){
                    var q = 0;
                }
            );
    }

    initialize();

}]);
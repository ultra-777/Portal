'use strict';

angular
    .module('explorer')
    .controller(
        'explorerTreeNodeController', [
            '$scope',
            'explorerService',
            '$modal',
            'commonMessageBoxService',
            function(scope, dataService, modal, messageBox) {

                var vm = this;
                vm.initialize = initialize;
                vm.isDraggingOver = false;
                vm.setDraggingOver = setDraggingOver;

                function setDraggingOver(draggingNode){
                    if (draggingNode){
                        vm.isDraggingOver = true;
                    }
                    else {
                        vm.isDraggingOver = false;
                    }
                    scope.$digest();
                }

                function initialize(data){
                    vm.data = data;
                }

                vm.newNode = function() {

                    var modalInstance = modal.open({
                        templateUrl: 'application/explorer/explorer.new-folder.view.html',
                        controller: 'explorerNewFolderController',
                        controllerAs: 'vm',
                        resolve: {
                            data: function() {
                                return vm.data;
                            }
                        }
                    });

                    modalInstance.result.then(function (newFolderName) {
                        vm.data.addChildFolder(newFolderName)
                            .then(function(error){
                                if (error)
                                    messageBox.show(
                                        'Exception',
                                        error
                                    );
                            });

                    }, function (dismissReason) {
                        // no need to do anything
                    });
                };

                vm.delete = function(){
                    vm.data.drop()
                        .then(function(error){
                            if (error)
                                messageBox.show(
                                    'Exception',
                                    error
                                );
                        });
                }

                vm.rename = function() {

                    var modalInstance = modal.open({
                        templateUrl: 'application/explorer/explorer.rename.view.html',
                        controller: 'explorerRenameController',
                        controllerAs: 'vm',
                        resolve: {
                            current: function () {
                                return vm.data;
                            }
                        }
                    });

                    modalInstance.result.then(function (newName) {
                        vm.data.rename(newName)
                            .then(function(error){
                                if (error)
                                    messageBox.show(
                                        'Exception',
                                        error
                                    );
                            });
                    }, function(reason){
                    });
                };
            }
        ]);

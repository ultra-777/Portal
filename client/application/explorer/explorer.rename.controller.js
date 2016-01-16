'use strict';

angular.
    module('explorer')
    .controller(
        'explorerRenameController', [
            '$scope',
            '$modalInstance',
            'commonMessageBoxService',
            'current',
    function(scope, modalInstance, messageBox, current) {

        var vm = this;

        vm.checkName = function (candidate) {
			var result = true;
            if (vm.current.neighbours) {
                angular.forEach(vm.current.neighbours, function(neighbour, key){
                    if (candidate.toLowerCase() == neighbour.toLowerCase()){
                        result = false;
                    }
                });
            }
			return result;
		};

        vm.ok = function () {
			if (!vm.checkName(vm.current.name))
                messageBox.show(
                    'The name ' + vm.current.name + ' already exists',
                    'Exception'
                );
			else
				modalInstance.close(vm.current.name);
		};

        vm.cancel = function () {
			modalInstance.dismiss('cancel');
		};

        function initialize(){
            var parent = current.parent;
            var neighbours = [];
            if (parent){
                angular.forEach(parent.subfolders, function(child, key){
                    if (current.name != child.name)
                        neighbours.push(child.name);
                });
            }
            vm.current = {
                _name: current.name,
                original: current.name,
                isDirty: false,
                neighbours: neighbours,
                get name(){
                    return this._name;
                },
                set name(newValue){
                    if (newValue != this._name){
                        this._name = newValue;
                        this.isDirty = true;
                    }
                }
            }
        }

        initialize();
	}
]);
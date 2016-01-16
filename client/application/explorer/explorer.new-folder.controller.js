'use strict';

angular
    .module('explorer')
    .controller(
        'explorerNewFolderController', [
            '$scope',
            '$modalInstance',
            'commonMessageBoxService',
            'data',
    function(scope, modalInstance, messageBox, data) {
		var vm = this;

		vm.current = {

		};

		vm.getProposedName = function () {
			var result = false;
			var index = -1;
			var template = 'New Folder';
			var candidate = '';
			while (!result) {
				index = index + 1;
				candidate = template;
				if (0 < index)
					candidate = candidate + ' ' + index;
				result = vm.checkName(candidate);
			}
			vm.current.name = candidate;
		};

		vm.checkName = function (candidate) {
			var result = true;
            if (vm.children) {
				angular.forEach(vm.children, function(child, key){
					if (child.name.toLowerCase() === candidate.toLowerCase()) {
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
			vm.isLoading = true;
			data.loadChildFolders()
				.then(function(result){
					vm.children = data.subfolders ? data.subfolders : [];
					vm.isLoading = false;
				});
		}

		initialize();
	}
]);
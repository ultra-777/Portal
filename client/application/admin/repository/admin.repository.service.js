'use strict';

//Menu service used for managing  menus
angular
	.module('admin-repository')
	.service('adminRepositoryService', [
		'$q',
		'$timeout',
		'commonMvcServiceImpl',
	function(q, timeout, data) {

		var vm = this;
		vm.getRepositories = getRepositories;

		function repositoryItem(source){
			this._isSelected = false;
			if(source){
				this.id = source.id;
				this.name = source.name;
				this._location = source.location;
			}
			this._locationBackup = this._location;
			this.isDirty = false;
		}

		repositoryItem.prototype = {
			toString: function(){
				return this.name;
			},
			get isSelected(){
				return this._isSelected;
			},
			set isSelected(newValue){
				this._isSelected = newValue;
			},
			get location(){
				return this._location;
			},
			set location(newValue){
				if (this._location != newValue) {
					this._location = newValue;
					this.isDirty = true;
				}
			},
			save: function(){
				this._locationBackup = this._location;
				this.isDirty = false;
			},
			cancel: function() {
				if (this.isDirty) {
					this._location = this._locationBackup;
					this.isDirty = false;
				}
			}
		}



		function getRepositories(){
			var defer = q.defer();

			timeout(function(){
				var repositories = [];
				for (var i = 0; i < 10; i++){
					var item = new repositoryItem({id: i, name: 'repository #' + i})
					repositories.push(item);
				}
				defer.resolve(repositories);
			}, 1000);
			return defer.promise;
		}

		function initialize(){

		}

		initialize();
	}
]);
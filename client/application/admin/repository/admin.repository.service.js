'use strict';

//Menu service used for managing  menus
angular
	.module('admin-repository')
	.service('adminRepositoryService', [
		'$q',
		'$timeout',
		'commonMvcServiceImpl',
		'commonMessageBoxService',
	function(q, timeout, data, messageBox) {

		var vm = this;
		vm.findRepositories = findRepositories;
		vm.getRepository = getRepository;
		vm.updateRepository = updateRepository;
		vm.initNewRepository = initNewRepository;
		vm.onNewInstanceCreated = onNewInstanceCreated;
		vm.removeRepository = removeRepository;

		function repositoryItem(source, newInstanceHandler){
			this._isSelected = false;
			this.apply(source);
			this.newInstanceHandler = newInstanceHandler;
		}

		repositoryItem.prototype = {
			toString: function(){
				return this.name;
			},
			apply: function(source){
				this.id = source ? source.id : null;
				this._name = source ? source.name : null;
				this._location = source ? source.location : null;
				this._isOpen = source ? source.isOpen : null;
				this.isDirty = false;
			},
			get isSelected(){
				return this._isSelected;
			},
			set isSelected(newValue){
				this._isSelected = newValue;
			},
			get name(){
				return this._name;
			},
			set name(newValue){
				if (this._name != newValue) {
					this._name = newValue;
					this.isDirty = true;
				}
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
			get isOpen(){
				return this._isOpen;
			},
			set isOpen(newValue){
				if (this._isOpen != newValue) {
					this._isOpen = newValue;
					this.isDirty = true;
				}
			},
			save: function(){
				var theObject = this;
				vm.updateRepository(this)
					.then(function(result){
						if (result){
							theObject.apply(result.instance);
							if (result.newInstanceHandler)
								result.newInstanceHandler(theObject);
						}
					}, function(error){
						messageBox.show(error, 'Saving data');
					});
			},
			cancel: function() {
				if (this.isDirty) {
					var theObject = this;
					if (theObject.id) {
						vm.getRepository(theObject.id)
							.then(function (result) {
								theObject.apply(result);
							}, function (error) {
								messageBox.show(error, 'Loading data');
							});
					}
					else {
						vm.repository = null;
					}
				}
			}
		}

		function initNewRepository(newRepositoryHandler){
			return new repositoryItem(null, newRepositoryHandler);
		}

		function removeRepository(id){
			return data.httpRequest(
				'POST',
				'repository/delete',
				{
					id: id
				});
		}

		function findRepositories(name){
			var defer = q.defer();

			data.httpRequest(
				'POST',
				'repository/find',
				{
					name: name
				})
				.then(function(instances){
					var result =
						instances ?
							instances.map(function(item){
								return new repositoryItem(item);
							}) : null;
					defer.resolve(result);
				}, function(error){
					defer.reject(error);
				});

			return defer.promise;
		}

		function getRepository(id){
			var defer = q.defer();

			data.httpRequest(
				'POST',
				'repository/get',
				{
					id: id
				})
				.then(function(instance){
					defer.resolve(instance ? new repositoryItem(instance) : null);
				}, function(error){
					defer.reject(error);
				});

			return defer.promise;
		}

		function updateRepository(instance){
			var defer = q.defer();

			if (instance.id){
				data.httpRequest(
					'POST',
					'repository/update',
					{
						id: instance.id,
						name: instance.name,
						location: instance.location,
						isOpen: instance.isOpen
					})
					.then(function(instance){
						defer.resolve({instance: (instance ? new repositoryItem(instance) : null)});
					}, function(error){
						defer.reject(error);
					});
			}
			else {
				var newInstanceHandler = instance.newInstanceHandler;
				data.httpRequest(
					'POST',
					'repository/create',
					{
						name: instance.name,
						location: instance.location,
						isOpen: instance.isOpen
					})
					.then(function(instance){
						defer.resolve({
							instance: (instance ? new repositoryItem(instance) : null),
							newInstanceHandler: newInstanceHandler
						});
					}, function(error){
						defer.reject(error);
					});
			}

			return defer.promise;
		}

		function onNewInstanceCreated(instance){

		}

		function initialize(){

		}

		initialize();
	}
]);
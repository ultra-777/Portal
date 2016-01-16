'use strict';

//Menu service used for managing  menus
angular
	.module('explorer')
	.service('explorerService', [
		'$q',
		'commonMvcServiceImpl',
	function(q, data) {

		var vm = this;
		vm.draggedNode = null;

		var controllerPrefix = '/explorer/';


		function nodeInfo(id, parent) {

			this.id = id;
			this.parent = parent;
			this.subfolders = null;
			this.files = null;
			this._isExpanded = false;
			this._isLoaded = false;
			this.isWaiting = true;

			var defer = q.defer();
			defer.resolve(this);
			this.nodePromise = defer.promise;

			if (!parent || parent.isExpanded)
				this.load();
		}

		nodeInfo.prototype = {
			get isRoot(){
				return this.parent ? false : true;
			},

			get isExpanded(){
				return this._isExpanded;
			},
			set isExpanded(newValue){
				if (this._isExpanded != newValue){
					if (newValue){
						if (!this.isContainer)
							return;

						if (this.subfolders){
							var promises = [];
							angular.forEach(this.subfolders, function(subfolder, key){
								promises.push(subfolder.load());
							});
							q.all(promises)
								.then(function(results) {
								}, function(error){

								});
						}
					}
					this._isExpanded = newValue;
				}
			},

			get isSelected(){
				return this._isSelected;
			},
			set isSelected(newValue){
				if (this._isSelected != newValue){
					var root = this.getRoot();
					if (root.selectedNode && (root.selectedNode !== this)){
						root.selectedNode.isSelected = false;
					}
					this._isSelected = newValue;
					root.selectedNode = this;
				}
			},

			moveChild: function(newChild){
				var defer = q.defer();
				var local = this;
				data.httpRequest('POST', controllerPrefix + 'moveChild', {parentId: this.id, childId: newChild.id})
					.then(function(){
						if (newChild.parent){
							var dropResult = local.dropCollectionChild(newChild.parent.subfolders, newChild);
							if (dropResult) {
								local.subfolders.push(newChild);
								newChild.parent = local;
								local.isSelected = true;

								if (!local.isExpanded)
									local.isExpanded = true;
							}
						}
						defer.resolve(null);
					}, function(err){
						defer.resolve(err);
					});
				return defer.promise;
			},

			drop: function(){
				var defer = q.defer();
				var local = this;
				vm.delete (local.id)
					.then(function(result){

						var parent = local.parent;
						if (parent){
							if (parent.subfolders){
								local.dropCollectionChild(parent.subfolders, local);
							}
						}

						defer.resolve(null);
					}, function(err){
						defer.resolve(err);
					});

				return defer.promise;
			},

			load: function(){
				var defer = q.defer();

				if (this._isLoaded)
					defer.resolve(this);
				else {

					var local = this;
					local.isWaiting = true;
					vm.getFolder(local.id)
						.then(function (folderData) {
								local.isContainer = folderData.isContainer;
								local.name = folderData.name;

								var subfolders = [];
								var files = [];
								if (folderData.children) {
									angular.forEach(folderData.children, function (child, key) {
										var childNode = new nodeInfo(child.id, local);
										if (child.isContainer) {
											subfolders.push(childNode);
										}
										else {
											files.push(childNode);
										}
									});
								}
								local.subfolders = subfolders;
								local.files = files;
								local._isLoaded = true;
								local.isWaiting = false;
								defer.resolve(local);
							},
							function (err) {
								local.isWaiting = false;
								local._isLoaded = true;
								local.lastError = err;
								defer.resolve(local);
							});
				}

				return defer.promise;
			},

			loadChildFolders: function(){
				var defer = q.defer();
				if (this.subfolders){
					var promises = [];
					angular.forEach(this.subfolders, function(subfolder, key){
						promises.push(subfolder.load());
					});
					q.all(promises)
						.then(function(results) {
							defer.resolve(true);
						}, function(error){
							defer.resolve(false);
						});
				}
				return defer.promise;
			},

			loadChildFiles: function(){
				var defer = q.defer();
				if (this.files){
					var promises = [];
					angular.forEach(this.files, function(file, key){
						promises.push(file.load());
					});
					q.all(promises)
						.then(function(results) {
							defer.resolve(true);
						}, function(error){
							defer.resolve(false);
						});
				}
				return defer.promise;
			},

			addChildFolder: function(newFolderName){
				var defer = q.defer();
				var local = this;
				vm.newFolder(local.id, newFolderName)
					.then(function (newFolderInfo) {
							if (!local.subfolders)
								local.subfolders = [];

							var newNode = new nodeInfo(newFolderInfo.id, local);
							local.subfolders.push(newNode);
							newNode.isSelected = true;

							if (!local.isExpanded)
								local.isExpanded = true;

							defer.resolve(null);
						},
						function (error) {
							defer.resolve(error);
						});
				return defer.promise;
			},

			rename: function(newName){
				var defer = q.defer();
				var local = this;
				vm.rename(local.id, newName)
					.then(function (result) {
							if (result){
								local.name = newName;
							}

							defer.resolve(null);
						},
						function (error) {
							defer.resolve(error);
						});
				return defer.promise;
			},

			getRoot: function(){
				var root = this;
				var parent = this.parent;
				while (parent){
					root = parent;
					parent = parent.parent;
				}
				return root;
			},

			iterateAncestors: function(checkSelf, iterator/*bool function(node, level)*/){
				var level = 0;
				if (checkSelf && iterator(this, level))
					return;
				var parent = this.parent;
				while (parent){
					level = level + 1;
					if (iterator(parent, level))
						return;
					parent = parent.parent;
				}
			},

			dropCollectionChild: function(collection, target){
				var targetIndex = -1;
				for (var i = 0; i < collection.length; i++){
					var candidate = collection[i];
					if (candidate === target){
						targetIndex = i;
						break;
					}
				}
				if (targetIndex > -1) {
					collection.splice(targetIndex, 1);
					target.parent = null;
					return true;
				}
				return false;
			},

			compareChildren: function (a, b) {
				if (a.name.toLowerCase() < b.name.toLowerCase())
					return -1;
				if (a.name.toLowerCase() > b.name.toLowerCase())
					return 1;
				return 0;
			}
		};

		vm.getData = function () {
			var defer = q.defer();
			data.httpRequest('POST', controllerPrefix + 'root', null)
				.then(function(result){
					if (result)
						defer.resolve(new nodeInfo(result.id));
					else
						defer.resolve(null);
				}, function(err){
					defer.resolve(null);
				});
			return defer.promise;
			// return data.httpRequest('GET', controllerPrefix + 'root', null);
		};

		vm.getFolder = function (id) {
			return data.httpRequest('POST', controllerPrefix + 'folder', { 'id': id });
		};

		vm.download = function (id) {
			return data.httpRequest('POST', controllerPrefix + 'download', { 'id': id });
		};

		vm.delete = function (id) {
			return data.httpRequest('POST', controllerPrefix + 'delete', { 'id': id });
		};

		vm.newFolder = function (id, name) {
			return data.httpRequest('POST', controllerPrefix + 'newFolder', { 'id': id, name: name });
		};

		vm.getDownloadUrl = function(id) {
			var url = controllerPrefix + 'download' + '?' + 'id=' + id;
			return url;
		};

		vm.initBlob = function (parentId, name, totalSize, chunkSize) {
			return data.httpRequest('POST', controllerPrefix + 'initBlob', { 'folderId': parentId, 'fileName': name, 'totalSize': totalSize, 'chunkSize': chunkSize });
		};

		vm.addBlobChunk = function (blobId, chunkIndex, data) {
			return data.httpRequest('POST', controllerPrefix + 'addBlobChunk', { 'blobId': blobId, 'chunkIndex': chunkIndex, 'data': data });
		};

		vm.releaseBlob = function (blobId) {
			return data.httpRequest('POST', controllerPrefix + 'releaseBlob', { 'blobId': blobId });
		};

		vm.rename = function (nodeId, newName) {
			return data.httpRequest('POST', controllerPrefix + 'rename', { 'id': nodeId, newName: newName });
		};

	}
]);
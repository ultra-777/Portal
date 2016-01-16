'use strict';

//Menu service used for managing  menus
angular
	.module('header')
	.service('headerMenuService', [
		'$window',
		'$rootScope',
		'$state',
		function(window, rootScope, state) {

			var vm = this;
			vm.menu = null;
			vm.reload = reload;
			vm.menuKeys = {
				signup: 1,
				signin: 2,
				signout: 3,
				adminUpdate: 4,
				adminRepository: 5,
				explorer: 6
			};

			function menuItem(){
				this.id = null,
				this.title = '',
				this.handler = null,
				this.children = []
			}

			menuItem.prototype = {

				addItem: function(id, handler, title, index){

					var targetItem = null;
					var existingItemIndex = this.getItemIndex(id);
					if (existingItemIndex > -1){
						targetItem = this.children[existingItemIndex];
						this.children.splice(existingItemIndex, 0);
					}
					else{
						var newItem = new menuItem();
						newItem.id = id;
						newItem.parent = this;
						targetItem = newItem;
					}

					targetItem.handler = handler;
					targetItem.title = title;


					var targetIndex =
						index ?
							(
								(index > this.children.length) ?
									this.children.length
									: ((index < 0) ? 0 : index)
							)
							: this.children.length;

					this.children.splice(targetIndex, 0, targetItem);
					return targetItem;
				},

				dropItem: function(id){
					var existingItemIndex = this.getItemIndex(id);
					if (existingItemIndex > -1){
						this.children.splice(existingItemIndex, 1);
						return true;
					}
					return false;
				},

				getItemIndex: function(id){
					if (!id)
						return -1;
					for (var i=0;i < this.children.length; i++){
						var item = this.children[i];
						if (item.id == id){
							return i;
						}
					}
					return -1;
				},

				getItem: function(id){
					var existingItemIndex = this.getItemIndex(id);
					if (existingItemIndex > -1){
						return this.children[existingItemIndex];
					}
					return null;
				},

				onClick: function(event){
					if (event) {
						event.stopPropagation();
						event.preventDefault();
					}
					this.close();
					this.handler && this.handler(this.id);
				},

				setReady: function(){
					this.isReady = true;
					for (var i=0;i < this.children.length; i++){
						var item = this.children[i];
						item.setReady();
					}
				},

				clear: function(){
					if (this.children && this.children.length > 0)
						this.children.splice(0, this.children.length);
				}
		}

			function onAction(id){
				switch(id){
					case vm.menuKeys.signup: // signup
						state.go('signup');
						break;
					case vm.menuKeys.signin: // signin
						state.go('signin');
						break;
					case vm.menuKeys.signout: // signout
						state.go('signout');
						break;
					case vm.menuKeys.adminUpdate: // admin-update
						state.go('admin-update');
						break;
					case vm.menuKeys.adminRepository: // admin-repository
						state.go('admin-repository');
						break;
					case vm.menuKeys.explorer: // explorer
						state.go('explorer');
						break;
					default:
						return;
				}
			}

			function reload(){
				vm.menu.clear();
				// var accountLine = window.sessionStorage.account;
				// accountLine ? JSON.parse(accountLine) : null;
				var account = rootScope.account;

				if (account){

					var isAdmin = false;
					var roles = account.roles;
					if (roles){

						angular.forEach(roles, function(role, key){
							if (role.name == 'admin'){
								isAdmin = true;
							}
						});
					}

					if (isAdmin){
						var adminMenuItem = vm.menu.addItem(null, null, 'Admin');
						adminMenuItem.addItem(vm.menuKeys.adminUpdate, onAction, 'Update');
						adminMenuItem.addItem(vm.menuKeys.adminRepository, onAction, 'Repository');
					}

					if (account.accountName) {

						var title = null;
						if (account.firstName || account.lastName) {
							title = (account.firstName ? (account.firstName + ' ') : '') +
									(account.lastName ? account.lastName : '');
						}
						else {
							title = account.accountName;
						}
					}
					var accountMenuItem = vm.menu.addItem(null, null, title);
					accountMenuItem.addItem(vm.menuKeys.signout, onAction, 'Signout');
					accountMenuItem.addItem(vm.menuKeys.explorer, onAction, 'Explorer');
				}
				else {
					var accountMenuItem = vm.menu.addItem(null, null, 'Enter');
					accountMenuItem.addItem(vm.menuKeys.signin, onAction, 'Signin');
					accountMenuItem.addItem(vm.menuKeys.signup, onAction, 'Signup');

					/*
					var signinMenuItem = vm.menu.addItem(vm.menuKeys.signin, onAction, 'Signin');
					signinMenuItem.addItem(vm.menuKeys.signup, onAction, 'Signup');
					*/
				}
			}

			function initialize(){
				vm.menu = new menuItem();
				reload();
			}

			initialize();
		}
	]);
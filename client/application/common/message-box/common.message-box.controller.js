'use strict';

angular
    .module('common')
    .controller(
        'commonMessageBoxController', [
            '$scope',
            '$mdDialog',
            'model',
    function (scope, mdDialog, model) {

        var vm = this;

        vm.title = model.title;
        vm.message = model.message;
        vm.okButtonTitle = model.okButtonTitle;
        vm.cancelButtonTitle = model.cancelButtonTitle;

        vm.ok = function () {
            //modalInstance.close();
            mdDialog.hide();
            };

        vm.cancel = function () {
            mdDialog.cancel();
        };

        vm.closeDialog = function () {
            mdDialog.hide();
        }

    }]);
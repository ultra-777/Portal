'use strict';

angular
    .module('common')
    .service('commonMessageBoxService', [
        '$modal',
        '$mdDialog',
    function (modal, mdDialog) {

        this.show = function (message, title, okButtonTitle, cancelButtonTitle) {

            return mdDialog.show({
                clickOutsideToClose: false,
                templateUrl: 'application/common/message-box/common.message-box.view.html',
                controller: 'commonMessageBoxController',
                controllerAs: 'vm',
                resolve: {
                    model: function () {
                        return {
                            title: title,
                            message: message,
                            okButtonTitle: okButtonTitle,
                            cancelButtonTitle: cancelButtonTitle
                        };
                    }
                }
            });

        }
    }]);
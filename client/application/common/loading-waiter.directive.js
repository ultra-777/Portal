'use strict';

angular
    .module('common')
    .directive("loadingWaiter", [function () {
        return {
            restrict: 'A',
            link: function (scope, element, attr) {

                var target = $(element);
                var imageUrl = attr.loadingWaiterImage ? attr.loadingWaiterImage : '/images/common/loading_wait.gif';
                var background = attr.loadingWaiterBackground ? attr.loadingWaiterBackground : '#f8f8f8';
                var opacity = attr.loadingWaiterOpacity ? attr.loadingWaiterOpacity : '.5';
                var waiterId = 'W' + (new Date()).valueOf();
                var elementTemplate =
                    '<div id="' +
                    waiterId +
                    '" style="position: absolute; z-index: 100000;background: url(' +
                    imageUrl +
                    ') no-repeat center ' +
                    background +
                    ';opacity: ' +
                    opacity +
                    '"/>';

                scope.$watch(attr.loadingWaiter, function (newValue, oldValue) {

                    if (newValue) {
                        var el = $(elementTemplate).width(target.width()).height(target.height());
                        target.prepend(el);
                    }
                    else {
                        target.find('#' + waiterId).remove();
                    }
                })
            }
        }
    }]);

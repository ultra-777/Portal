'use strict';

angular
    .module('header')
    .directive("headerMenuItem", ['$timeout', '$compile', '$parse', 'recursionHelper',
        function (timeout, compile, parse, recursionHelper) {
        return {
            restrict: 'E',
            replace: true,
            scope: {
                content: '=content'
            },
            compile: function (element, attributes) {
                return recursionHelper.compile(element, function (theScope, theElement, theAttrs, theController) {

                    timeout(function () {
                        theScope.content.setReady();
                    }, 1);

                    element.mouseenter(function() {
                        //console.log('ul.mouseenter');
                        $( this ).find('ul').each(function() {
                            $(this).show();
                        });
                    });

                    if (theScope.content) {

                        theScope.content.close = function () {
                            $("ul.main-menu").find("ul").hide();
                        }
                    }

                })
            },
            templateUrl: 'application/header/header-menu-item.view.html'
        }
    }]);
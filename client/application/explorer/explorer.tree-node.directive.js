angular
    .module('explorer')
        .directive('explorerTreeNode', ['$compile', '$parse', 'commonRecursionHelper',
    function(compile, parse, recursionHelper) {
        return {
            scope: {
                folderInfo: '=folderInfo',
                parentNode: '=parentNode',
                selectionChangeHandler: '&onSelectionChanged'
            },
            restrict: 'EA',

            templateUrl: 'application/explorer/explorer.tree-node.view.html',
            replace: true,
            controller: 'explorerTreeNodeController',
            compile: function(element) {
                return recursionHelper.compile(element, function(theScope, theElement, theAttrs, theController){
                    theScope.data = theScope.folderInfo;
                    theScope.parent = theScope.parentNode;
                    theScope.init && theScope.init();
                })
            }

        };
    }
]);

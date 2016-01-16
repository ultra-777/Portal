angular
    .module('explorer')
        .directive('explorerTreeNode', [
            '$compile',
            '$parse',
            '$document',
            'commonRecursionHelper',
            'explorerService',
    function(compile, parse, document, recursionHelper, explorer) {
        return {
            scope: {
                nodePromise: '=nodePromise',
                selectionChangeHandler: '&onSelectionChanged'
            },
            restrict: 'EA',

            templateUrl: 'application/explorer/explorer.tree-node.view.html',
            replace: true,
            controller: 'explorerTreeNodeController',
            controllerAs: 'vm',
            compile: function(element) {

                return recursionHelper.compile(element, function(theScope, theElement, theAttrs, theController){

                    //var vm = this;
                    var vm = theScope.vm;
                    //vm.data = null;

                    vm.getController = function(target){
                        var elementQuery = angular.element(target);
                        var controller = elementQuery.controller('explorerTreeNode');
                        return controller;
                    };
                    vm.applyChildPointerEvents = function (targetObj, enable) {
                        var cList = targetObj.childNodes
                        for (var i = 0; i < cList.length; ++i) {
                            try{
                                var child = cList[i];
                                if (child.style){
                                    child.style.pointerEvents = enable ? 'auto' : 'none';
                                    if (child.hasChildNodes())
                                        vm.applyChildPointerEvents(child, enable);
                                }
                            } catch (err) {
                                console.log('applyChildPointerEvents.error: ' + error);
                            }
                        }
                    }
                    vm.parseNodeId = function(dataTransfer){
                        if (dataTransfer) {
                            var data = Number(dataTransfer.getData('text'));
                            if (!isNaN(data)){
                                return Number(data);
                            }
                        }
                        return null;
                    }
                    vm.checkDropAbility = function(node){
                        if (explorer.graggedNode) {
                            var sourceNodeId = explorer.graggedNode.id;
                            var isAncestor = false;
                            node.iterateAncestors(true, function (ancestor, level) {
                                if (ancestor.id == sourceNodeId) {
                                    isAncestor = true;
                                    return true;
                                }
                            });
                            if (explorer.graggedNode.parent === node)
                                isAncestor = true;
                            return (!isAncestor);
                        }
                    }



                    var domElement = element.get(0);

                    domElement.addEventListener('dragstart', function (e) {
                        var controller = vm.getController(e.target);
                        var node = controller ? controller.data : null;

                        if (e.dataTransfer) {
                            e.dataTransfer.effectAllowed = 'move';

                            if(e.dataTransfer.setDragImage) {
                                var dragIcon = document.get(0).createElement('img');
                                dragIcon.src = 'application/explorer/folder.png';
                                dragIcon.width = 32;
                                dragIcon.height = 32;

                                e.dataTransfer.setDragImage(dragIcon, -10, -10);
                            }

                            //e.dataTransfer.setData('text', node.id);
                            explorer.graggedNode = node;
                        }

                        console.log('--dragstart: ' + (node ? (node.id + ' - ' + node.name) : 'none'));
                    }, false);

                    domElement.addEventListener('dragend', function(e){
                        var controller = vm.getController(e.target);
                        var node = controller ? controller.data : null;

                        explorer.graggedNode = null;


                        console.log('--dragend: ' + (node ? node.name : 'none'));
                    });

                    domElement.addEventListener('drop', function(e){

                        if (e.stopPropagation) {
                            e.stopPropagation(); // stops the browser from redirecting.
                        }

                        var controller = vm.getController(e.target);
                        var node = controller ? controller.data : null;

                        if (node){
                            controller.setDraggingOver();
                            if (vm.checkDropAbility(node)) {
                                if (explorer.graggedNode) {
                                    node.moveChild(explorer.graggedNode)
                                        .then(function (err) {
                                            if (!err) {
                                                console.log('--moveChild: ' + err);
                                            }
                                            else
                                                console.log('--moveChild: Ok');
                                        });
                                }
                            }
                        }

                        explorer.graggedNode = null;

                        console.log('--drop: ' + (node ? node.name : 'none'));

                        return false;
                    });

                    domElement.addEventListener('dragenter', function(e){
                        e.stopPropagation();

                        vm.applyChildPointerEvents(e.target);

                        var controller = vm.getController(e.target);
                        var node = controller ? controller.data : null;

                        var controllerSrc = vm.getController(e.srcElement);

                        if (controller && node){

                            if (vm.checkDropAbility(node))
                                controller.setDraggingOver(node);

                        }

                        console.log('--dragenter: ' + (node ? node.name : 'none'));

                        if (controllerSrc){
                            if (controllerSrc.data)
                                console.log('--dragenter.src: ' + (controllerSrc.data ? controllerSrc.data.name : 'none') );
                        }
                    },
                    false);

                    domElement.addEventListener('dragleave', function(e){
                        e.stopPropagation();

                        vm.applyChildPointerEvents(e.target, true);

                        var controller = vm.getController(e.target);
                        var node = controller ? controller.data : null;

                        if (controller){
                            controller.setDraggingOver();
                        }

                        console.log('--dragleave: ' + (node ? node.name : 'none'));
                    },
                    false);

                    domElement.addEventListener('dragover', function(e){
                        if (e.stopPropagation) {
                            e.stopPropagation();
                        }
                        if (e.preventDefault) {
                            e.preventDefault(); // Necessary. Allows us to drop.
                        }
                        if (e.dataTransfer) {
                            var controller = vm.getController(e.target);
                            var node = controller ? controller.data : null;
                            e.dataTransfer.dropEffect = node ? 'move' : 'none';
                        }

                    },
                    false);



                    if (theScope.nodePromise){
                        theScope.nodePromise.then(function(data) {
                            vm.data = data;
                            theController.initialize(data);
                        });
                    }
                });
            }
        };
    }
]);

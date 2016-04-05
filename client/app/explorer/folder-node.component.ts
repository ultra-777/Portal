/**
 * Created by Andrey on 27.03.2016.
 */
import {Component, Output, OnInit, Input, OnChanges, EventEmitter, OnDestroy, ElementRef, ViewEncapsulation} from 'angular2/core';
import {BrowserDomAdapter} from 'angular2/platform/browser'
import {DROPDOWN_DIRECTIVES} from 'ng2-bootstrap/ng2-bootstrap';
import {MessageBoxService} from '../common/message-box/message-box.service';
import {Subscription} from 'rxjs/Subscription';
import 'rxjs/add/operator/map';
import {Node} from './node';
import {NewFolderComponent} from './new-folder.component';
import {NewFolderContext} from "./new-folder-context";
import {RenameComponent} from './rename.component';
import {RenameContext} from "./rename-context";
import {OrderNodesByNamePipe} from './node-order-by-name.pipe'

import {ModalService} from '../common/modal/providers/modal-service';
import {ResultImpl} from "../common/result-impl";
import {UploadComponent} from "./upload.component";
import {UploadHandler} from "./upload-handler";
import {NodeDto} from "./node.dto";
import {BytesPipe} from "./bytes-pipe";
import {UploadContext} from "./upload-context";


@Component({
    selector: 'folder-node',
    templateUrl: 'folder-node.component.html',
    directives: [DROPDOWN_DIRECTIVES, FolderNodeComponent],
    providers: [MessageBoxService, ModalService, BrowserDomAdapter],
    inputs: ['nodePromise'],
    pipes:[OrderNodesByNamePipe],
    encapsulation: ViewEncapsulation.None,
    moduleId: module.id
})

export class FolderNodeComponent implements OnInit, OnDestroy, OnChanges {

    public data: Node;
    public isDraggingOver: boolean;
    private _isOpen: boolean;
    private static _draggedNode: Node;
    private static _draggedImage: any;

    @Output()
    public onNodeSelected = new EventEmitter();

    private _selectionSubscription: Subscription = null;

    constructor(private _messageBox: MessageBoxService, private _modal: ModalService, private _element: ElementRef, private _dom: BrowserDomAdapter) {

    }

    ngOnInit() {
        let local = this;
        let domElement = this._element.nativeElement;
        if (!FolderNodeComponent._draggedImage){
            let dragIcon = local._dom.defaultDoc().createElement('img');
            dragIcon.src = './app/explorer/folder.png';
            dragIcon.width = 32;
            dragIcon.height = 32;
            FolderNodeComponent._draggedImage = dragIcon;
        }

        let applyChildPointerEvents = function (targetObj, enable) {
            let cList = targetObj.childNodes
            for (let i = 0; i < cList.length; ++i) {
                try{
                    let child = cList[i];
                    if (child.style){
                        child.style.pointerEvents = enable ? 'auto' : 'none';
                        if (child.hasChildNodes())
                            applyChildPointerEvents(child, enable);
                    }
                } catch (err) {
                    console.log('applyChildPointerEvents.error: ' + err);
                }
            }
        }

        let checkDropAbility = function(node){
            if (FolderNodeComponent._draggedNode) {
                let sourceNodeId = FolderNodeComponent._draggedNode.id;
                let isAncestor = false;
                node.iterateAncestors(true, function (ancestor, level) {
                    if (ancestor.id == sourceNodeId) {
                        isAncestor = true;
                        return true;
                    }
                });
                if (FolderNodeComponent._draggedNode.parent === node)
                    isAncestor = true;
                return (!isAncestor);
            }
        }

        domElement.addEventListener('dragstart', function (e) {
            let node = local.data;
            if (!node.parent)
                return;
            if (e.dataTransfer) {
                e.dataTransfer.effectAllowed = 'move';
                if(e.dataTransfer.setDragImage) {
                    e.dataTransfer.setDragImage(FolderNodeComponent._draggedImage, -10, -10);
                }
                FolderNodeComponent._draggedNode = node;
            }
            e.stopPropagation();
            //console.log('--FolderNodeComponent.dragstart: ' + (node ? (node.id + ' - ' + node.name) : 'none'));
        });

        domElement.addEventListener('dragend', function(e){
            let node = local.data;
            FolderNodeComponent._draggedNode = null;
            e.stopPropagation();
            //console.log('--FolderNodeComponent.dragend: ' + (node ? node.name : 'none'));
        });

        domElement.addEventListener('dragenter', function(e){
            applyChildPointerEvents(e.target, false);
            let node = local.data;
            if (node){
                if (checkDropAbility(node))
                    local.setDraggingOver(node);
            }
            e.stopPropagation();
            //console.log('--FolderNodeComponent.dragenter: ' + (node ? node.name : 'none'));
        },
        false);

        domElement.addEventListener('dragleave', function(e){
            applyChildPointerEvents(e.target, true);
            var node = local.data;
            local.setDraggingOver(null);
            e.stopPropagation();
            //console.log('--FolderNodeComponent.dragleave: ' + (node ? node.name : 'none'));
        },
        false);

        domElement.addEventListener('dragover', function(e){
            let node = null;
            if (e.dataTransfer) {
                node = local.data;
                e.dataTransfer.dropEffect = node ? 'move' : 'none';
            }

            if (e.stopPropagation)
                e.stopPropagation();
            if (e.preventDefault)
                e.preventDefault(); // Necessary. Allows us to drop.

            //console.log('--FolderNodeComponent.dragover: ' + (node ? node.name : 'none'));
        },
        false);

        domElement.addEventListener('drop', function(e){

            let node = local.data;

            if (node){
                local.setDraggingOver(null);
                if (checkDropAbility(node)) {
                    if (FolderNodeComponent._draggedNode) {
                        node.moveChild(FolderNodeComponent._draggedNode)
                            .then(function (err) {
                                if (!err) {
                                    node.refresh();
                                    //console.log('--FolderNodeComponent.moveChild: Ok');
                                }
                                else{
                                    console.log('--FolderNodeComponent.moveChild.eror: ' + err);
                                }
                            });
                    }
                }
            }

            FolderNodeComponent._draggedNode = null;

            if (e.stopPropagation)
                e.stopPropagation(); // stops the browser from redirecting.

            //console.log('--FolderNodeComponent.drop: ' + (node ? node.name : 'none'));

            return false;
        });


        console.log('FolderNodeComponent.ngOnInit');
    }

    ngOnDestroy() {
        this.dropSelectionSubscription();
        console.log('FolderNodeComponent.ngOnDestroy');
    }

    ngOnChanges(changes) {
        if (changes){
            for (let key in changes){
                let change = changes[key];
                let newValue = change.currentValue;
                let local = this;
                switch (key){
                    case 'nodePromise':
                        if (newValue){
                            newValue.then(function(data) {
                                local.data = data;
                                local.initialize(data);
                            });
                        }
                        else
                            local.initialize(null);

                        break;
                    default:
                        break;
                }
            }
        }
    }

    initialize(data: Node){
        this.data = data;
        this.dropSelectionSubscription();
        if (this.data)
            this._selectionSubscription = this.data.selectedNode$.subscribe(node => this.onNodeSelectionHandler(node));
    }

    setDraggingOver(draggingNode: Node) {
        if (draggingNode) {
            this.isDraggingOver = true;
        }
        else {
            this.isDraggingOver = false;
        }
    }

    get isOpen(): boolean{
        return this._isOpen;
    }

    set isOpen(newValue: boolean){
        if (this._isOpen != newValue){
            this._isOpen = newValue;
            console.log('--is open: ' + newValue);
        }
    }

    public select(event){
        if (!this.data)
            return;
        this.data.isSelected = !this.data.isSelected;
    }

    public toggled(open:boolean):void {
        console.log('Dropdown is now: ', open);
    }


    public newFolder() {
        let siblings = this.data.getChildrenNames();
        let context = new NewFolderContext(siblings);
        let dialog = this._modal.open(NewFolderComponent, context);
        let local = this;
        dialog.then((resultPromise) => {
            resultPromise.result.then((result: ResultImpl<string>) => {
                if(result.succeeded) {
                    local.data.addContainer(result.data)
                        .then(function (error) {
                            if (error) {
                                local._messageBox.showOk(
                                    'Exception',
                                    error
                                );
                            }
                            else{
                                local.data.refresh();
                            }
                        });
                }
            });
        });
    };

    public delete(){
        let local = this;
        this.data.drop()
            .then(function(error){
                if (error)
                    local._messageBox.showOk(
                        'Exception',
                        error
                    );
            });
    }

    public rename() {
        let siblings = this.data.getNeighbourNames();
        let context = new RenameContext(this.data.name, siblings);
        let dialog = this._modal.open(RenameComponent, context);
        let local = this;
        dialog.then((resultPromise) => {
            resultPromise.result.then((result: ResultImpl<string>) => {
                if(result.succeeded) {
                    local.data.rename(result.data)
                        .then(function (error) {
                            if (error) {
                                local._messageBox.showOk(
                                    'Exception',
                                    error
                                );
                            }
                            else{
                                local.data.refreshParent();
                            }
                        });
                }
            });
        });
    };

    public upload(){
        let siblings = this.data.getChildrenNames();
        let context = new UploadContext(siblings);
        let dialog = this._modal.open(UploadComponent, context);
        let local = this;
        dialog.then((resultPromise) => {
            resultPromise.result.then((result: ResultImpl<File>) => {
                if(result.succeeded) {

                    let uploader = local.data.addLeaf(result.data, context.name);
                    uploader.result.then((result: ResultImpl<NodeDto>) => {
                        if (result.succeeded) {
                            let bytesPipe = new BytesPipe();
                            local._messageBox.showOk(
                                'Name: ' + result.data.name + '<br/>' +
                                'Size: ' + uploader.source.size + '<br/>' +
                                'Duration: ' + uploader.duration + ' sec.' + '<br/>' +
                                'Rate: ' + bytesPipe.transform((uploader.source.size / uploader.duration), 1) + ' / sec',
                                'Transfer complete'
                            );
                            console.log('--result: ' + JSON.stringify(uploader));

                        }
                        else{
                            local._messageBox.showOk(JSON.stringify(result.data), 'Exception');
                        }
                    });
                }
            });
        });
    }

    private onNodeSelectionHandler(node: Node){
        this.onNodeSelected.emit(node);
    }

    private dropSelectionSubscription(){
        if (this._selectionSubscription) {
            this._selectionSubscription.unsubscribe();
            this._selectionSubscription = null;
        }
    }
}

/**
 * Created by Andrey on 27.03.2016.
 */
import {Component, Output, OnInit, Input, OnChanges, EventEmitter, OnDestroy, ElementRef, NgZone, ViewEncapsulation} from 'angular2/core';
import {BrowserDomAdapter} from 'angular2/platform/browser'
import {DROPDOWN_DIRECTIVES} from 'ng2-bootstrap/ng2-bootstrap';
import { PROGRESSBAR_DIRECTIVES } from 'ng2-bootstrap/ng2-bootstrap';
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
import {NodeComponent} from "./node.component";


@Component({
    selector: 'folder-node',
    templateUrl: 'app/explorer/folder-node.component.html',
    directives: [DROPDOWN_DIRECTIVES, FolderNodeComponent, PROGRESSBAR_DIRECTIVES],
    providers: [MessageBoxService, ModalService, BrowserDomAdapter],
    inputs: ['nodePromise'],
    pipes:[OrderNodesByNamePipe],
    encapsulation: ViewEncapsulation.None
})

export class FolderNodeComponent extends NodeComponent implements OnInit, OnDestroy {

    public isDraggingOver: boolean;
    private static _draggedImage: any;
    public uploadPercent: number;
    public isUploading: boolean;

    @Output()
    public onNodeSelected = new EventEmitter();

    private _selectionSubscription: Subscription = null;
    private _uploadPercentSubscription: Subscription = null;

    constructor(messageBox: MessageBoxService, modal: ModalService, private _element: ElementRef, private _zone: NgZone, private _dom: BrowserDomAdapter) {
        super(messageBox, modal);
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
            if (NodeComponent.draggedNode) {
                let sourceNodeId = NodeComponent.draggedNode.id;
                let isAncestor = false;
                node.iterateAncestors(true, function (ancestor, level) {
                    if (ancestor.id == sourceNodeId) {
                        isAncestor = true;
                        return true;
                    }
                });
                if (NodeComponent.draggedNode.parent === node)
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
                NodeComponent.draggedNode = node;
            }
            e.stopPropagation();
            //console.log('--FolderNodeComponent.dragstart: ' + (node ? (node.id + ' - ' + node.name) : 'none'));
        });

        domElement.addEventListener('dragend', function(e){
            let node = local.data;
            NodeComponent.draggedNode = null;
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
            console.log('--FolderNodeComponent.dragenter: ' + (node ? node.name : 'none'));
        },
        false);

        domElement.addEventListener('dragleave', function(e){
            applyChildPointerEvents(e.target, true);
            var node = local.data;
            local.setDraggingOver(null);
            e.stopPropagation();
            console.log('--FolderNodeComponent.dragleave: ' + (node ? node.name : 'none'));
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
            applyChildPointerEvents(e.target, true);
            let node = local.data;

            if (node){
                local.setDraggingOver(null);
                if (checkDropAbility(node)) {
                    if (NodeComponent.draggedNode) {
                        node.moveChild(NodeComponent.draggedNode)
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

            NodeComponent.draggedNode = null;

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

    initialize(){
        this.dropSelectionSubscription();
        if (this.data) {
            this._selectionSubscription = this.data.selectedNode$.subscribe(node => this.onNodeSelectionHandler(node));
        }
    }

    setDraggingOver(draggingNode: Node) {
        if (draggingNode) {
            this.isDraggingOver = true;
        }
        else {
            this.isDraggingOver = false;
        }
    }

    public newFolder() {
        let siblings = this.data.getChildrenNames();
        let context = new NewFolderContext(siblings);
        let dialog = this.modal.open(NewFolderComponent, context);
        let local = this;
        dialog.then((resultPromise) => {
            resultPromise.result.then((result: ResultImpl<string>) => {
                if(result.succeeded) {
                    local.data.addContainer(result.data)
                        .then(function (error) {
                            if (error) {
                                local.messageBox.showOk(
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

    public upload(event){
        let siblings = this.data.getChildrenNames();
        let context = new UploadContext(siblings);
        let dialog = this.modal.open(UploadComponent, context);
        let local = this;
        dialog.then((resultPromise) => {
            resultPromise.result.then((result: ResultImpl<File>) => {
                if(result.succeeded) {

                    local.uploadPercent = 0;
                    local.isUploading = true;
                    let uploader = local.data.addLeaf(result.data, context.name);
                    let subscription = uploader.percent$.subscribe(newValue => this.onUploadPercentChangeHandler(newValue));
                    uploader.result.then((result: ResultImpl<NodeDto>) => {
                        subscription.unsubscribe();
                        local.isUploading = false;
                        if (result.succeeded) {
                            let bytesPipe = new BytesPipe();
                            local.messageBox.showOk(
                                'Name: ' + result.data.name + '<br/>' +
                                'Size: ' + uploader.source.size + '<br/>' +
                                'Duration: ' + uploader.duration + ' sec.' + '<br/>' +
                                'Rate: ' + bytesPipe.transform((uploader.source.size / uploader.duration), 1) + ' / sec',
                                'Transfer complete'
                            );
                            console.log('--result: ' + JSON.stringify(uploader));

                        }
                        else{
                            local.messageBox.showOk(JSON.stringify(result.data), 'Exception');
                        }
                    });
                }
            });
        });
    }

    private onNodeSelectionHandler(node: Node){
        this.onNodeSelected.emit(node);
    }

    private onUploadPercentChangeHandler(value: number){
        let local = this;
        //let newValue =  Number((value * 100).toFixed(0));
        let newValue =  Math.floor(value * 100);
        if (newValue != local.uploadPercent) {
            this._zone.run(() => {
                local.uploadPercent = newValue;
                console.log('upload percent: ' + local.uploadPercent);
            });
        }
    }

    private dropSelectionSubscription(){
        if (this._selectionSubscription) {
            this._selectionSubscription.unsubscribe();
            this._selectionSubscription = null;
        }
    }
}

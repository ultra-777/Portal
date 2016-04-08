/**
 * Created by Andrey on 27.03.2016.
 */
import {Component, OnInit, Input, Output, OnChanges, EventEmitter, OnDestroy, ElementRef, ViewEncapsulation} from 'angular2/core';
import {BrowserDomAdapter} from 'angular2/platform/browser'
import {DROPDOWN_DIRECTIVES} from 'ng2-bootstrap/ng2-bootstrap';
import {MessageBoxService} from '../common/message-box/message-box.service';
import {Subscription} from 'rxjs/Subscription';
import 'rxjs/add/operator/map';
import {Node} from './node';

import {ModalService} from '../common/modal/providers/modal-service';
import {ResultImpl} from "../common/result-impl";
import {BytesPipe} from "./bytes-pipe";
import {RenameComponent} from "./rename.component";
import {RenameContext} from "./rename-context";
import {NodeComponent} from "./node.component";


@Component({
    selector: 'file-node',
    templateUrl: 'file-node.component.html',
    directives: [DROPDOWN_DIRECTIVES, FileNodeComponent],
    providers: [MessageBoxService, ModalService, BrowserDomAdapter],
    inputs: ['nodePromise'],
    pipes:[BytesPipe],
    encapsulation: ViewEncapsulation.None,
    moduleId: module.id
})

export class FileNodeComponent extends NodeComponent implements OnInit, OnDestroy {

    private static _draggedImage: any;

    @Output()
    public onNodeSelected = new EventEmitter();

    constructor(messageBox: MessageBoxService, modal: ModalService, private _element: ElementRef, private _dom: BrowserDomAdapter) {
        super(messageBox, modal);
    }

    ngOnInit() {
        let local = this;
        let domElement = this._element.nativeElement;
        if (!FileNodeComponent._draggedImage){
            let dragIcon = local._dom.defaultDoc().createElement('img');
            dragIcon.src = './app/explorer/file.png';
            dragIcon.width = 32;
            dragIcon.height = 32;
            FileNodeComponent._draggedImage = dragIcon;
        }


        domElement.addEventListener('dragstart', function (e) {
            let node = local.data;
            if (!node.parent)
                return;
            if (e.dataTransfer) {
                e.dataTransfer.effectAllowed = 'move';
                if(e.dataTransfer.setDragImage) {
                    e.dataTransfer.setDragImage(FileNodeComponent._draggedImage, -10, -10);
                }
                NodeComponent.draggedNode = node;
            }
            e.stopPropagation();
            //console.log('--FileNodeComponent.dragstart: ' + (node ? (node.id + ' - ' + node.name) : 'none'));
        });

        domElement.addEventListener('dragend', function(e){
            let node = local.data;
            NodeComponent.draggedNode = null;
            e.stopPropagation();
            //console.log('--FileNodeComponent.dragend: ' + (node ? node.name : 'none'));
        });



        console.log('FileNodeComponent.ngOnInit');
    }

    ngOnDestroy() {
        console.log('FileNodeComponent.ngOnDestroy');
    }
}

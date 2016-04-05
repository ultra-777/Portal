/**
 * Created by Andrey on 27.03.2016.
 */
import {Component, OnInit, Input, Output, OnChanges, EventEmitter, OnDestroy, ElementRef, ViewEncapsulation} from 'angular2/core';
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


@Component({
    selector: 'file-node',
    templateUrl: 'file-node.component.html',
    directives: [DROPDOWN_DIRECTIVES, FileNodeComponent],
    providers: [MessageBoxService, ModalService],
    inputs: ['nodePromise'],
    pipes:[BytesPipe],
    encapsulation: ViewEncapsulation.None,
    moduleId: module.id
})

export class FileNodeComponent implements OnInit, OnDestroy, OnChanges {

    public data: Node;
    public isDraggingOver: boolean;

    @Output()
    public onNodeSelected = new EventEmitter();

    constructor(private _messageBox: MessageBoxService, private _modal: ModalService, private _element: ElementRef) {

    }

    ngOnInit() {

        console.log('FileNodeComponent.ngOnInit');
    }

    ngOnDestroy() {
        console.log('FileNodeComponent.ngOnDestroy');
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
    }

    setDraggingOver(draggingNode: Node) {
        if (draggingNode) {
            this.isDraggingOver = true;
        }
        else {
            this.isDraggingOver = false;
        }
    }

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
}

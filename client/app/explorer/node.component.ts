import {Component, OnChanges, ViewEncapsulation} from 'angular2/core';
import {Node} from './node';
import {ModalService} from "../common/modal/providers/modal-service";
import {MessageBoxService} from "../common/message-box/message-box.service";
import {ResultImpl} from "../common/result-impl";
import {RenameComponent} from "./rename.component";
import {RenameContext} from "./rename-context";

export class NodeComponent implements OnChanges{
    protected static draggedNode: Node;

    public data: Node;

    constructor(protected messageBox: MessageBoxService, protected modal: ModalService) {

    }

    protected initialize(){

    }

    public ngOnChanges(changes) {
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
                                local.initialize();
                            });
                        }
                        else
                            local.initialize();

                        break;
                    default:
                        break;
                }
            }
        }
    }

    public select(event){
        if (!this.data)
            return;
        this.data.isSelected = !this.data.isSelected;
    }

    public expand(event){
        if (!this.data)
            return;
        this.data.isExpanded = !this.data.isExpanded;
    }

    public rename(event) {
        let siblings = this.data.getNeighbourNames();
        let context = new RenameContext(this.data.name, siblings);
        let dialog = this.modal.open(RenameComponent, context);
        let local = this;
        dialog.then((resultPromise) => {
            resultPromise.result.then((result: ResultImpl<string>) => {
                if(result.succeeded) {
                    local.data.rename(result.data)
                        .then(function (error) {
                            if (error) {
                                local.messageBox.showOk(
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

    public delete(){
        let local = this;
        this.data.drop()
            .then(function(error){
                if (error)
                    local.messageBox.showOk(
                        'Exception',
                        error
                    );
            });
    }
}



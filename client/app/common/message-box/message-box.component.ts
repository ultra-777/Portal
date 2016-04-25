import {Component, provide, ElementRef, Injectable, Injector, IterableDiffers, KeyValueDiffers, Renderer, ViewEncapsulation} from 'angular2/core';
import {ICustomModal, ICustomModalComponent} from '../modal/models/custom-modal';
import {ModalDialogInstance} from '../modal/models/modal-dialog-instance';
import {ModalConfig} from '../modal/models/modal-config';
import {Modal} from '../modal/providers/modal';
import {MessageBoxType, MessageBoxContent} from './message-box.content';


@Component({
    selector: 'message-box',
    templateUrl: 'app/common/message-box/message-box.component.html',
    providers: [Modal, ElementRef],
    encapsulation: ViewEncapsulation.None
})
export class MessageBoxComponent implements ICustomModalComponent {
    dialog: ModalDialogInstance;
    context: MessageBoxContent;

    constructor(dialog: ModalDialogInstance, modelContentData: ICustomModal) {
        this.dialog = dialog;
        this.context = <MessageBoxContent>modelContentData;
    }

    ok(event): void {
        event.stopPropagation();
        this.dialog.close(true);
    }

    get isNoVisible() {
        return this.context.type == MessageBoxType.yesNo || this.context.type == MessageBoxType.yesNoCancel;
    }

    no(event) {
        event.stopPropagation();
        this.dialog.close(false);
    }

    get isCancelVisible() {
        return this.context.type == MessageBoxType.yesNoCancel;
    }

    cancel(event) {
        event.stopPropagation();
        this.dialog.close(null);
    }

    beforeClose(): boolean{
        return false;
    }

    beforeDismiss(): boolean{
        return false;
    }
};


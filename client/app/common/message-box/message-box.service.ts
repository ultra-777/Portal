import {Component, provide, ElementRef, Injectable, Injector, IterableDiffers, KeyValueDiffers, Renderer, ViewEncapsulation} from 'angular2/core';
import {ICustomModal, ICustomModalComponent} from '../modal/models/custom-modal';
import {ModalDialogInstance} from '../modal/models/modal-dialog-instance';
import {ModalConfig} from '../modal/models/modal-config';
import {Modal} from '../modal/providers/modal';
import {MessageBoxType, MessageBoxContent} from './message-box.content';
import {MessageBoxComponent} from './message-box.component';

@Injectable()
export class MessageBoxService {
    constructor(
        private modal: Modal,
        private elementRef: ElementRef,
        private injector: Injector,
        private _renderer: Renderer) {
    }

    showOk(
        message: string,
        title: string = '',
        okText: string = 'Ok'): Promise<boolean> {
        return this.show(new MessageBoxContent(message, title, MessageBoxType.ok, okText));
    }

    showYesNo(
        message: string,
        title: string = '',
        yesText: string = 'Yes',
        noText: string = 'No'): Promise<boolean> {
        return this.show(new MessageBoxContent(message, title, MessageBoxType.yesNo, yesText, noText));
    }

    showYesNoCancel(
        message: string,
        title: string = '',
        yesText: string = 'Yes',
        noText: string = 'No',
        cancelText: string = 'Cancel'): Promise<boolean> {
        return this.show(new MessageBoxContent(message, title, MessageBoxType.yesNoCancel, yesText, noText, cancelText));
    }

    private show(context: MessageBoxContent): Promise<any> {
        let dialog: Promise<ModalDialogInstance>;
        let component = MessageBoxComponent;

        // Workaround for https://github.com/angular/angular/issues/4330
        // providing resolved providers to IterableDiffers, KeyValueDiffers & Renderer.
        // Since customWindow uses 'ngClass' directive & 'ngClass' requires the above providers we need to supply them.
        // One would expect angular to get them automatically but that not the case at the moment.
        let bindings = Injector.resolve([
            provide(ICustomModal, { useValue: context }),
            provide(IterableDiffers, { useValue: this.injector.get(IterableDiffers) }),
            provide(KeyValueDiffers, { useValue: this.injector.get(KeyValueDiffers) }),
            provide(Renderer, { useValue: this._renderer })
        ]);


        dialog = this.modal.open(
            <any>component,
            bindings,
            new ModalConfig(true, 27));

        return new Promise<boolean>(resolve => {
            dialog.then((resultPromise) => {
                resultPromise.result.then((result) => {
                    resolve(result);
                });
            });
        });
    }
}
import {Component, Input, Injector, Injectable, IterableDiffers, KeyValueDiffers, Renderer, provide, ElementRef, ViewEncapsulation} from 'angular2/core';
import {CORE_DIRECTIVES} from 'angular2/common';
import * as moment from 'moment';

import {ModalConfig} from '../modal/models/modal-config';
import {Modal} from '../modal/providers/modal';
import {ModalDialogInstance} from '../modal/models/modal-dialog-instance';
import {ICustomModal, ICustomModalComponent} from '../modal/models/custom-modal';
import {DateTimeEditorDialog} from './date-time.editor.dialog.component';

@Injectable()
export class DateTimeEditorDialogService {
    constructor(
        private modal: Modal,
        private elementRef: ElementRef,
        private injector: Injector,
        private _renderer: Renderer) {
    }

    show(context: Date): Promise<any> {
        let dialog: Promise<ModalDialogInstance>;
        let component = DateTimeEditorDialog;

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

        return new Promise<any>(resolve => {
            dialog.then((resultPromise) => {
                resultPromise.result.then((result) => {
                    resolve(result);
                });
            });
        });
    }
}
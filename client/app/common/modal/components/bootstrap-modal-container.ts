import { Component } from 'angular2/core';

import {ModalDialogInstance} from '../models/modal-dialog-instance';

/**
 * A component that acts as a top level container for an open modal window.
 */
@Component({
    selector: 'bootstrap-modal',
    host: {
        'tabindex': '0',
        'role': 'dialog',
        'class': 'in modal',
        'style': 'display: flex; align-items:center;',
        '[style.position]': 'position',
        '(body:keydown)': 'documentKeypress($event)',
        '(click)': 'onClick()'
    },
    templateUrl: 'app/common/modal/components/bootstrap-modal-container.html'
})
export class BootstrapModalContainer {
    dialogInstance: ModalDialogInstance;
    public position: string;

    constructor(dialogInstance: ModalDialogInstance) {
        this.dialogInstance = dialogInstance;

        if (!dialogInstance.inElement) {
            this.position = null;
        } else {
            this.position = 'absolute';
        }
    }

    onContainerClick($event) {
        $event.stopPropagation();
    }

    onClick() {
        return !this.dialogInstance.config.isBlocking && this.dialogInstance.dismiss();
    }

    documentKeypress(event: KeyboardEvent) {
        if ( this.dialogInstance.config.keyboard &&
            (<Array<number>>this.dialogInstance.config.keyboard).indexOf(event.keyCode) > -1) {
            this.dialogInstance.dismiss();
        }
    }
}

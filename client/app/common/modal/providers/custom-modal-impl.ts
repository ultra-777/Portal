/**
 * Created by Andrey on 31.03.2016.
 */
import {Injectable, Injector, Inject} from 'angular2/core';
import {ICustomModal, ICustomModalComponent} from '../models/custom-modal';
import {ModalDialogInstance} from '../models/modal-dialog-instance';
import {Modal} from './modal';
import {ModalConfig} from "../models/modal-config";
import {ModalContext} from './../models/modal-context';

@Injectable()
export class CustomModalImpl<T extends ModalContext> implements ICustomModalComponent {
    dialog:  ModalDialogInstance;
    context: T;

    constructor(injector: Injector) {
        this.dialog = injector.get(ModalDialogInstance);
        this.context = injector.get('context');
    }

    beforeClose(): boolean{
        return false;
    }

    beforeDismiss(): boolean{
        return false;
    }
};


/**
 * Created by aeb10 on 30.03.2016.
 */
import {
    provide,
    ElementRef,
    Injectable,
    Injector,
    IterableDiffers,
    KeyValueDifferFactory,
    KeyValueDiffers,
    DynamicComponentLoader,
    ApplicationRef,
    Renderer,
    APP_COMPONENT
} from 'angular2/core';
import {ICustomModal, ICustomModalComponent} from './../models/custom-modal';
import {Modal} from './modal';
import {ModalDialogInstance} from './../models/modal-dialog-instance';
import {ModalConfig} from './../models/modal-config';
import {ModalContext} from './../models/modal-context';
import {Subscription} from 'rxjs/Subscription.d';
import 'rxjs/add/operator/map';

@Injectable()
export class ModalService{

    constructor(private _injector: Injector, private _renderer: Renderer, private _modal: Modal) {

    }

    public open(component: any, context?: any) {
        let dialog:Promise<ModalDialogInstance>;

        // Workaround for https://github.com/angular/angular/issues/4330
        // providing resolved providers to IterableDiffers, KeyValueDiffers & Renderer.
        // Since customWindow uses 'ngClass' directive & 'ngClass' requires the above providers we need to supply them.
        // One would expect angular to get them automatically but that not the case at the moment.
        let bindings = Injector.resolve([
            provide('context', {useValue: context}),
            //provide(context['constructor'], {useFactory: () => {console.log('ModalService.open.useFactory'); return context;}}),
            provide(ICustomModal, {useValue: component}),
            provide(IterableDiffers, {useValue: this._injector.get(IterableDiffers)}),
            provide(KeyValueDiffers, {useValue: this._injector.get(KeyValueDiffers)}),
            provide(Renderer, {useValue: this._renderer})
        ]);

        dialog = this._modal.open(
            <any>component,
            bindings,
            new ModalConfig(true, 27));

        return dialog;
    }

    private getClassName(instance: any) {
        var funcNameRegex = /function (.{1,})\(/;
        var results  = (funcNameRegex).exec(instance["constructor"].toString());
        return (results && results.length > 1) ? results[1] : "";
    }
}

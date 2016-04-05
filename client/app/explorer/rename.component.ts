/**
 * Created by aeb10 on 29.03.2016.
 */
import {Component, Injector, ViewEncapsulation} from 'angular2/core';
import {NgForm}    from 'angular2/common';
import {RenameContext} from './rename-context';
import {ResultImpl} from '../common/result-impl';
import {CustomModalImpl} from "../common/modal/providers/custom-modal-impl";


@Component({
    selector: 'rename',
    templateUrl: 'rename.component.html',
    providers: [],
    encapsulation: ViewEncapsulation.None,
    moduleId: module.id
})
export class RenameComponent extends CustomModalImpl<RenameContext> {

    private _current: string;
    original: string;
    isValid: boolean = true;
    isDirty: boolean;

    constructor(injector: Injector) {
        super(injector);

        if (this.context) {
            this._current = this.context.original;
            this.original = this.context.original;
        }
    }

    ok(event) {
        event.stopPropagation();
        if (!this.validate())
            return;
        this.dialog.close(ResultImpl.success<string>(this.current));
    }

    cancel(event) {
        event.stopPropagation();
        this.dialog.close(ResultImpl.failure<string>(null));
    }

    onSubmit(){
        if (!this.validate())
            return;
        this.dialog.close(ResultImpl.success<string>(this.current));
    }

    get current() : string {
        return this._current;
    }

    set current(newValue: string){
        let candidate = newValue ? newValue.toLowerCase() : null;
        let currentHandler = this._current ? this._current.toLowerCase() : null;
        if (candidate != currentHandler){
            this._current = newValue;
            if (this.context) {
                this.isValid = this.context.validate(newValue);
                if (this.context.original)
                    this.isDirty = (this.context.original.toLowerCase() != candidate);
            }
        }
    }

    private validate() : boolean {
        return this.isValid && this.isDirty;
    }
};

/**
 * Created by aeb10 on 29.03.2016.
 */
import {Component, Injector, ViewEncapsulation} from 'angular2/core';
import {NewFolderContext} from './new-folder-context';
import {ResultImpl} from '../common/result-impl';
import {CustomModalImpl} from "../common/modal/providers/custom-modal-impl";

@Component({
    selector: 'new-folder',
    templateUrl: 'app/explorer/new-folder.component.html',
    providers: [],
    encapsulation: ViewEncapsulation.None
})
export class NewFolderComponent extends CustomModalImpl<NewFolderContext> {
    private _current: string;
    isValid: boolean = true;

    constructor(injector: Injector) {
        super(injector);
    }

    ok(event) {
        event.stopPropagation();
        if (!this.isValid)
            return;
        this.dialog.close(ResultImpl.success<string>(this.current));
    }

    cancel(event) {
        event.stopPropagation();
        this.dialog.close(ResultImpl.failure<string>(false));
    }

    onSubmit(){
        if (!this.isValid)
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
            }
        }
    }
}


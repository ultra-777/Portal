/**
 * Created by aeb10 on 29.03.2016.
 */
import {Component, Injector, ViewChild, ViewEncapsulation} from 'angular2/core';
import {NgForm}    from 'angular2/common';
import {UploadContext} from './upload-context';
import {ResultImpl} from '../common/result-impl';
import {CustomModalImpl} from "../common/modal/providers/custom-modal-impl";


@Component({
    selector: 'upload',
    templateUrl: 'upload.component.html',
    providers: [],
    encapsulation: ViewEncapsulation.None,
    moduleId: module.id
})
export class UploadComponent extends CustomModalImpl<UploadContext> {

    private _current: File;
    private _path: string;
    private _name: string;
    isValid: boolean = true;

    @ViewChild('source') fileInput;

    constructor(injector: Injector) {
        super(injector);

    }

    ok(event) {
        event.stopPropagation();
        if (!this.validate())
            return;
        if (this.context)
            this.context.name = this.name;
        this.dialog.close(ResultImpl.success<File>(this.current));
    }

    cancel(event) {
        event.stopPropagation();
        this.dialog.close(ResultImpl.failure<File>(null));
    }

    onSubmit(){
        if (!this.validate())
            return;
        if (this.context)
            this.context.name = this.name;
        this.dialog.close(ResultImpl.success<File>(this.current));
    }

    get path() : string {
        return this._path;
    }

    set path(newValue: string){
        if (this._path != newValue){
            this._path = newValue;
        }
    }

    get current() : File {
        return this._current;
    }

    set current(newValue: File){
        if (this._current != newValue){
            this._current = newValue;
            this.name = this._current ? this._current.name : null;
        }
    }

    get name() : string {
        return this._name;
    }

    set name(newValue: string){
        let candidate = newValue ? newValue.toLowerCase() : null;
        let currentHandler = this._name ? this._name.toLowerCase() : null;
        if (candidate != currentHandler){
            this._name = newValue;
            if (this.context) {
                this.isValid = this.context.validate(newValue);
            }
        }
    }

    public onFileChanged(event){
        let files = event.currentTarget.files;
        if (files && files.length > 0){
            this.current = files[0];
            this.path = event.currentTarget.value;
        }

    }

    public onBrowse(event){
        if (this.fileInput)
            this.fileInput.nativeElement.click();
        event.stopPropagation();
        event.preventDefault();

    }

    private validate() : boolean {
        return this.isValid;
    }
};

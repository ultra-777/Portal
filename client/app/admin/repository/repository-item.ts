/**
 * Created by Andrey on 10.04.2016.
 */
import {RepositoryDto} from './repository.dto';
import {ResultImpl} from "../../common/result-impl";
import {RepositoryService} from "./service";

export class RepositoryItem {

    public id: number;
    public created: Date;
    public isDirty: boolean;

    private _name: string;
    private _location: string;
    private _isOpen: boolean;
    private _childFilesLimit: number;
    private _childFoldersLimit: number;
    private _isSelected: boolean;


    constructor (source: RepositoryDto){
        this.apply(source);
    }

    private apply(source: RepositoryDto){
        this.id = source ? source.id : null;
        this._name = source ? source.name : null;
        this._location = source ? source.location : null;
        this._isOpen = source ? source.isOpen : null;
        this._childFilesLimit = source ? source.childFilesLimit : null;
        this._childFoldersLimit = source ? source.childFoldersLimit : null;
        this.created = (source && source.created) ? new Date(source.created) : null;
        this.isDirty = false;
    }

    public get name() : string {
        return this._name;
    }
    public set name(newValue: string) {
        if (this._name != newValue){
            this._name = newValue;
            this.isDirty = true;
        }
    }

    public get location() : string {
        return this._location;
    }
    public set location(newValue: string) {
        if (this._location != newValue){
            this._location = newValue;
            this.isDirty = true;
        }
    }

    public get isOpen() : boolean {
        return this._isOpen;
    }
    public set isOpen(newValue: boolean) {
        if (this._isOpen != newValue){
            this._isOpen = newValue;
            this.isDirty = true;
        }
    }

    public get childFilesLimit() : number {
        return this._childFilesLimit;
    }
    public set childFilesLimit(newValue: number) {
        if (this._childFilesLimit != newValue){
            this._childFilesLimit = newValue;
            this.isDirty = true;
        }
    }

    public get childFoldersLimit() : number {
        return this._childFoldersLimit;
    }
    public set childFoldersLimit(newValue: number) {
        if (this._childFoldersLimit != newValue){
            this._childFoldersLimit = newValue;
            this.isDirty = true;
        }
    }

    public get isSelected() : boolean {
        return this._isSelected;
    }
    public set isSelected(newValue: boolean) {
        if (this._isSelected != newValue){
            this._isSelected = newValue;
        }
    }

    public save() : Promise<ResultImpl<boolean>> {
        let local = this;
        return new Promise<ResultImpl<boolean>>(resolve => {
            RepositoryService.updateRepository(local).then(result => {
                if (result.succeeded) {
                    local.apply(result.data);
                    resolve(ResultImpl.success<boolean>(true));
                }
                else {
                    resolve(ResultImpl.failure<boolean>(result.message));
                }
            })
        });
    }


    public cancel(): Promise<ResultImpl<boolean>> {
        let local = this;
        return new Promise<ResultImpl<boolean>>(resolve => {
            if (local.isDirty) {
                let local = this;
                if (this.id) {
                    RepositoryService.getRepository(this.id).then(result => {
                        if (result.succeeded) {
                            local.apply(result.data);
                            resolve(ResultImpl.success<boolean>(true));
                        }
                        else {
                            resolve(ResultImpl.failure<boolean>(result.message));
                        }
                    });
                }
                else {
                    resolve(ResultImpl.success<boolean>(true));
                }
            }
            else {
                resolve(ResultImpl.success<boolean>(true));
            }
        });
    };
}

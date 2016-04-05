import {MessageBoxService} from "../common/message-box/message-box.service";
import {BytesPipe} from "./bytes-pipe";
import {NodeDto} from "./node.dto";
import {ResultImpl} from '../common/result-impl';
import {Observable} from 'rxjs/Observable';
import {ReplaySubject} from 'rxjs/subject/ReplaySubject';
import 'rxjs/add/operator/publishReplay';


export class UploadHandler {

    private _currentUploader: XMLHttpRequest;
    private _isUploading: boolean;
    private _percent: number;
    private _transferred: number;
    private _rate: number;
    private _size: number;
    private _duration: number;
    private _result: Promise<ResultImpl<NodeDto>>;

    public get parentNodeId() : number{
        return this._parentNodeId;
    }

    public get source() : File{
        return this._source;
    }

    public get size() : number{
        return this._size;
    }

    public get isUploading() : boolean{
        return this._isUploading;
    }

    public get percent() : number{
        return this._percent;
    }

    public get transferred() : number{
        return this._transferred;
    }

    public get rate() : number{
        return this._rate;
    }

    public get duration() : number{
        return this._duration;
    }

    public get result() : Promise<ResultImpl<NodeDto>>{
        return this._result;
    }

    constructor(private _source: File, private _parentNodeId: number) {
        if (_source)
            this._size = _source.size;
    }

    public static transfer(file: File, parentNodeId: number, name: string = null) : UploadHandler{
        if (!file || !parentNodeId)
            return null;

        let handler = new UploadHandler(file, parentNodeId);

        handler._result = new Promise<ResultImpl<NodeDto>>(resolve => {
            if (typeof file.size !== 'number') {
                //local._messageBox.showOk('The file specified is no longer valid', 'transfer');
                resolve(ResultImpl.failure<NodeDto>('The file specified is no longer valid'));
                return;
            }

            if (!(window['File'] && window['FileReader'] && window['FileList'] && window['Blob'])) {
                resolve(ResultImpl.failure<NodeDto>('The File API is not supported by current browser'));
                return;
            }


            let d = new Date();
            let startTime = d.getTime();
            let lastTime = startTime;
            handler._transferred = 0;
            handler._isUploading = true;

            handler._currentUploader = new XMLHttpRequest();
            var form = new FormData();
            form.append(parentNodeId, '');
            form.append("file", file, name ? name : file.name);

            handler._currentUploader.upload.onprogress = function (event) {
                let progress = event.lengthComputable ? event.loaded / event.total : 0;

                handler._percent = progress;
                console.log('--percent: ' + handler._percent);
                let dd = new Date();
                let currentTime = dd.getTime();
                let interval = currentTime - lastTime;
                let transferred = (event.lengthComputable ? event.loaded : 0);
                let transferredBytes = transferred - handler._transferred;
                handler._transferred = transferred;
                console.log('--transferred: ' + handler._transferred);
                if (interval >= (1000)) {
                    lastTime = currentTime;
                    handler._rate = transferredBytes * 1000 / interval;
                    handler._duration = Math.floor((currentTime - startTime) / 1000);
                }
            };

            handler._currentUploader.onload = function () {

                let dd = new Date();
                let currentTime = dd.getTime();
                handler._duration = (currentTime - startTime) / 1000;

                let response = <ResultImpl<NodeDto>>JSON.parse(handler._currentUploader.response);

                handler._currentUploader = null;
                handler._isUploading = false;
                resolve(response);
            };

            handler._currentUploader.onerror = function (error) {
                handler._currentUploader = null;
                handler._isUploading = false;
                resolve(ResultImpl.failure<NodeDto>(JSON.stringify(error)));
            };

            handler._currentUploader.onabort = function () {
                handler._currentUploader = null;
                handler._isUploading = false;
                resolve(ResultImpl.failure<NodeDto>('Transfer aborted'));
            };

            handler._currentUploader.open("POST", "/explorer/UploadFile", true);

            handler._currentUploader.withCredentials = false;

            handler._currentUploader.send(form);
        });

        return handler;
    }
}

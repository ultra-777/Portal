/**
 * Created by Andrey on 14.03.2016.
 */

import {Injectable} from 'angular2/core';
import {Http, Headers} from 'angular2/http';
import {Observable} from 'rxjs/Observable';
import {ReplaySubject} from 'rxjs/subject/ReplaySubject';
import {Subscription} from 'rxjs/Subscription';
import 'rxjs/add/operator/publishReplay';


import {ResultImpl} from '../common/result-impl';
import {HttpHandler} from '../common/http-handler';
import {Node} from './node';
import {NodeDto} from './node.dto';


@Injectable()
export class ExplorerService {

    private static _isInitialized: boolean;
    private static _controllerPrefix: string = '/explorer/';

    constructor() {

        if (!ExplorerService._isInitialized) {
            ExplorerService._isInitialized = true;
        }
    }

    getRoot() : Promise<ResultImpl<NodeDto>> {
        return HttpHandler
                .Post<ResultImpl<NodeDto>>(
                    ExplorerService._controllerPrefix + 'root',
                    null);
        // return data.httpRequest('GET', controllerPrefix + 'root', null);
    };

    getNode(id): Promise<ResultImpl<NodeDto>> {
        return HttpHandler.Post<ResultImpl<NodeDto>>(
            ExplorerService._controllerPrefix + 'node',
            {
                'id': id
            });
    };

    download(id) {
        return HttpHandler.Post<ResultImpl<any>>(
            ExplorerService._controllerPrefix + 'download',
            {
                'id': id
            });
        // return data.httpRequest('POST', controllerPrefix + 'download', { 'id': id });
    };

    delete(id) {
        return HttpHandler.Post<ResultImpl<any>>(
            ExplorerService._controllerPrefix + 'delete',
            {
                'id': id
            });
        // return data.httpRequest('POST', controllerPrefix + 'delete', { 'id': id });
    };

    newFolder(id, name) {
        return HttpHandler.Post<ResultImpl<any>>(
            ExplorerService._controllerPrefix + 'newFolder',
            {
                'id': id,
                'name': name
            });
        //return data.httpRequest('POST', controllerPrefix + 'newFolder', { 'id': id, name: name });
    };

    getDownloadUrl(id) {
        var url = ExplorerService._controllerPrefix + 'download' + '?' + 'id=' + id;
        return url;
    };

    initBlob(parentId, name, totalSize, chunkSize) {
        return HttpHandler.Post<ResultImpl<any>>(
            ExplorerService._controllerPrefix + 'initBlob',
            {
                'folderId': parentId,
                'fileName': name,
                'totalSize': totalSize,
                'chunkSize': chunkSize
            });
        // return data.httpRequest('POST', controllerPrefix + 'initBlob', { 'folderId': parentId, 'fileName': name, 'totalSize': totalSize, 'chunkSize': chunkSize });
    };

    addBlobChunk(blobId, chunkIndex, data) {
        return HttpHandler.Post<ResultImpl<any>>(
            ExplorerService._controllerPrefix + 'addBlobChunk',
            {
                'blobId': blobId,
                'chunkIndex': chunkIndex,
                'data': data
            });
        // return data.httpRequest('POST', controllerPrefix + 'addBlobChunk', { 'blobId': blobId, 'chunkIndex': chunkIndex, 'data': data });
    };

    releaseBlob(blobId) {
        return HttpHandler.Post<ResultImpl<any>>(
            ExplorerService._controllerPrefix + 'releaseBlob',
            {
                'blobId': blobId
            });
        //return data.httpRequest('POST', controllerPrefix + 'releaseBlob', { 'blobId': blobId });
    };

    rename (nodeId, newName) {
        return HttpHandler.Post<ResultImpl<any>>(
            ExplorerService._controllerPrefix + 'rename',
            {
                'id': nodeId,
                'newName': newName
            });
        // return data.httpRequest('POST', controllerPrefix + 'rename', { 'id': nodeId, newName: newName });
    };

    moveChild (id, newChildId){
        return HttpHandler.Post<ResultImpl<any>>(
            ExplorerService._controllerPrefix + 'moveChild',
            {
                'parentId': id,
                'childId': newChildId
            });
    }
}

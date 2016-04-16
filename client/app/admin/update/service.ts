/**
 * Created by Andrey on 10.04.2016.
 */
import {Injectable} from 'angular2/core';
import {Http, Headers} from 'angular2/http';

import {ResultImpl} from '../../common/result-impl';
import {HttpHandler} from '../../common/http-handler';


@Injectable()
export class UpdateService {

    private static _controllerPrefix: string = '/update/';

    constructor() {

    }

    public pull (): Promise<ResultImpl<string>> {
        return this.call('pull');
    };

    public install (): Promise<ResultImpl<string>> {
        return this.call('install');
    };

    public build (): Promise<ResultImpl<string>> {
        return this.call('build');
    };

    public restart (): Promise<ResultImpl<string>> {
        return this.call('restart');
    };

    public reboot (): Promise<ResultImpl<string>> {
        return this.call('reboot');
    };

    private call(action: string): Promise<ResultImpl<string>> {
        return HttpHandler.post<ResultImpl<string>>(
            UpdateService._controllerPrefix + action,
            null);
    }
}


import {Http} from 'angular2/http';
import {Injectable, Injector} from 'angular2/core';
import {Observable} from 'rxjs/Observable';
import {HubSummary} from './hub-summary';
import 'rxjs/add/operator/share';

@Injectable()
export class ConfigurationService {

    constructor(private _http: Http) {
    }

    getOperatorHubSummary(): Observable<HubSummary> {
        return this._http
            .post('/api/configuration/operatorHubSummary', null)
            .map((response: any) => response.json());
    }
  
}
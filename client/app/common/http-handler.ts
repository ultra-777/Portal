/**
 * Created by Andrey on 15.03.2016.
 */
import {Injector} from 'angular2/src/core/di';
import {Http, HTTP_PROVIDERS, Headers} from 'angular2/http';
import {Observable} from 'rxjs/Observable';
import {JsonEx} from './json-ex';

export class HttpHandler {

    private static _http: Http = null;
    private static _headers = new Headers({ 'Content-Type': 'application/json' });

    public static post<T>(url: string, data?: Object): Promise<T> {
        return new Promise<T>(resolve => {
            HttpHandler.getHttp()
                .post(
                    url,
                    data ? JSON.stringify(data) : null,
                    { headers: HttpHandler._headers}
                )
                .map((res: any) => JsonEx.parse2Lower<T>(res.text()))
                .subscribe((result) => {
                    resolve(result);
                });
        });
    }

    public static get<T>(url: string, data?: Object): Promise<T> {
        let finalUrl = HttpHandler.buildGetUrl(url, data);
        return new Promise<T>(resolve => {
            HttpHandler.getHttp()
                .get(
                    finalUrl
                )
                .map((res: any) => JsonEx.parse2Lower<T>(res.text()))
                .subscribe((result) => {
                    resolve(result);
                });
        });
    }

    private static buildGetUrl(url: string, data?: Object){
        let finalUrl = url;
        if (finalUrl && data && (typeof data == 'object')){
            let index = 0;
            for (let key in data){
                let theValue = data[key];
                if (!theValue)
                    continue;
                if (index == 0)
                    finalUrl = finalUrl + '?';
                else
                    finalUrl = finalUrl + '&';

                finalUrl = finalUrl + key + '=' + theValue.toString();

                index = index + 1;
            }
        }
        return finalUrl;
    }

    private static getHttp() : Http{
        if (HttpHandler._http == null) {
            let injector = Injector.resolveAndCreate([HTTP_PROVIDERS]);
            let http = injector.get(Http);
            if (!http)
                throw new Error('http has not been injected');
            HttpHandler._http = http;
        }
        return HttpHandler._http;
    }
}

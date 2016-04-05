/// <reference path="../../../../typings/tsd.d.ts" />
/// <reference path="../../../../node_modules/angular2/typings/es6-promise/es6-promise.d.ts" />
import {Injectable} from 'angular2/core';
import {Observable} from 'rxjs/Observable';
import {ReplaySubject} from 'rxjs/subject/ReplaySubject';
import {Subscription} from 'rxjs/Subscription';
import 'rxjs/add/operator/publishReplay';

import {ConfigurationService} from '../configuration/configuration.service';
import {HubSummary} from '../configuration/hub-summary';
import {TaskDto} from './task.dto';
import {ResultImpl} from '../result-impl';
import {AccountDto} from './account.dto';


@Injectable()
export class OperatorService  {

    private static _isInitialized: boolean = false;
    private static _proxy: any = null;
    private static _messages$: Observable<string>;
    private static _messageObserver: any;

    private static _tasks$: Observable<TaskDto>;
    private static _taskObserver: any;

    private static _account$: Observable<AccountDto>;
    private static _accountObserver: ReplaySubject<AccountDto>;
    
    constructor(private _configurationService: ConfigurationService) {

        if (!OperatorService._isInitialized) {
            
            OperatorService._messages$ =
                new Observable(observer => OperatorService._messageObserver = observer)
                    .share();

            OperatorService._tasks$ =
                new Observable(observer => OperatorService._taskObserver = observer)
                    .share();

            OperatorService._accountObserver = new ReplaySubject<AccountDto>(1);
            OperatorService._account$ = OperatorService._accountObserver;
                    
            var operatorHubSummarySubscription =
                _configurationService
                    .getOperatorHubSummary()
                    .subscribe(proxyData => {
                        OperatorService.initOperatorProxy(proxyData);
                        operatorHubSummarySubscription.unsubscribe();
                    });

            
            OperatorService._isInitialized = true;
        }
    }

    public get tasks$(): Observable<TaskDto> {
        return OperatorService._tasks$;
    }

    public get messages$(): Observable<string> {
            return OperatorService._messages$;
    }

    public get account$(): Observable<AccountDto> {
        return OperatorService._account$;
    }

    public send(message: string) {
        if (OperatorService._proxy)
            return OperatorService._proxy.invoke('send', message);
        return null;
    }

    public Signin() {

        return new Promise<ResultImpl<AccountDto>>(resolve => {

            if (!OperatorService._proxy)
                resolve(<ResultImpl<AccountDto>>{ succeeded: false, message: 'proxy is not ready' });
            else {
                OperatorService._proxy.invoke('signin').then((response) => {
                    let responseData = <ResultImpl<AccountDto>>response;
                    resolve(responseData);
                    if (responseData.data && responseData.succeeded) {
                        OperatorService._accountObserver.next(responseData.data);
                    }
                });
            }
        });
    }

    public Signout() {

        return new Promise<ResultImpl<boolean>>(resolve => {

            if (!OperatorService._proxy)
                resolve(<ResultImpl<boolean>>{ succeeded: false, message: 'proxy is not ready' });
            else {
                OperatorService._proxy.invoke('signout').then((response) => {

                    let responseData = <ResultImpl<boolean>>response;
                    resolve(responseData);
                    if (responseData.succeeded)
                            OperatorService._accountObserver.next(null);

                });
            }
        });
    }
    
    private static initOperatorProxy(hubSummary: HubSummary) {
        var targetPath = hubSummary.url + '/signalr';
        var hubConnection = window['$'].hubConnection;
        var connection = hubConnection(targetPath, { useDefaultPath: false });
        var proxy = connection.createHubProxy(hubSummary.name);

        proxy.on('onNotification', function (result: string) {
            if (OperatorService._messageObserver)
                OperatorService._messageObserver.next(result);
        });

        proxy.on('onNewTask', function (result: TaskDto) {
            if (OperatorService._taskObserver)
                OperatorService._taskObserver.next(result);
        });
        
        connection.start()
            .done(function () {
                OperatorService._proxy = proxy;
                OperatorService._proxy.invoke('send', 'cheers ...');
                console.log('operator service - connected');
            })
            .fail(function (error) {
                OperatorService._proxy = null;
                console.log('operator service - failed to connect: ' + error);
            });
    }
}
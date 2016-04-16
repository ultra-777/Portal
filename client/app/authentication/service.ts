/**
 * Created by Andrey on 14.03.2016.
 */

import {Injectable} from 'angular2/core';
import {Http, Headers} from 'angular2/http';
import {Observable} from 'rxjs/Observable';
import {ReplaySubject} from 'rxjs/subject/ReplaySubject';
import {Subscription} from 'rxjs/Subscription';
import 'rxjs/add/operator/publishReplay';



import {SessionDto} from './session.dto.ts';
import {AccountDto} from './account.dto.ts';
import {ResultImpl} from '../common/result-impl';
import {HttpHandler} from '../common/http-handler';


@Injectable()
export class AuthenticationService {

    private static _isInitialized: boolean;
    private static _session: SessionDto;
    private static _session$:Observable<SessionDto>;
    private static _sessionObserver:ReplaySubject<SessionDto>;
    private static _account$:Observable<AccountDto>;
    private static _accountObserver:ReplaySubject<AccountDto>;

    constructor() {

        if (!AuthenticationService._isInitialized) {

            AuthenticationService._sessionObserver = new ReplaySubject<SessionDto>(1);
            AuthenticationService._session$ = AuthenticationService._sessionObserver;

            AuthenticationService._accountObserver = new ReplaySubject<AccountDto>(1);
            AuthenticationService._account$ = AuthenticationService._accountObserver;

            AuthenticationService._isInitialized = true;

            this.LoadSession();
        }
    }

    public get account$():Observable<AccountDto> {
        return AuthenticationService._account$;
    }

    public get session$():Observable<SessionDto> {
        return AuthenticationService._session$;
    }

    public Signup(login: string, password: string, email?: string, firstName?: string, lastName?: string) : Promise<ResultImpl<AccountDto>> {

        let promise =
            HttpHandler
                .post<ResultImpl<AccountDto>>(
                    '/security/signup',
                    {
                        login: login,
                        password: password,
                        email: email,
                        firstName: firstName,
                        lastName: lastName
                    });

        this.HandleAuthentication(promise);

        return promise;
    }

    public Signin(login: string, password: string) : Promise<ResultImpl<AccountDto>> {

        let promise =
            HttpHandler
                .post<ResultImpl<AccountDto>>(
                    '/security/signin',
                    {
                        login: login,
                        password: password
                    });

        this.HandleAuthentication(promise);

        return promise;
    }

    public Signout() : Promise<ResultImpl<any>> {

        let promise =
            HttpHandler
                .post<ResultImpl<AccountDto>>(
                    '/security/signout');

        this.HandleAuthentication(promise);

        return promise;
    }

    private LoadSession(){
        let promise =
            HttpHandler
                .post<ResultImpl<SessionDto>>(
                    '/security/getSessionInfo',
                    null);

        promise.then((result) => {
            if (result.succeeded){
                let session = result.data;
                AuthenticationService._session = session;

                AuthenticationService._sessionObserver.next(session);
                if (session.account)
                    AuthenticationService._accountObserver.next(session.account);
            }
        });
    }

    private HandleAuthentication(promise: Promise<ResultImpl<AccountDto>>){
        promise.then((result) => {
            if (result.succeeded){
                if (AuthenticationService._session)
                    AuthenticationService._session.account = result.data;

                AuthenticationService._accountObserver.next(result.data);
            }
        });
    }
}

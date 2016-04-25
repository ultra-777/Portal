import {Component, OnInit, OnDestroy, Output, ElementRef, Renderer, EventEmitter, ViewEncapsulation} from 'angular2/core';
import {RouteConfig, Router, ROUTER_DIRECTIVES} from 'angular2/router';
import {NgClass, NgStyle} from 'angular2/common';
import {HomeComponent} from './home/home.component';
import {HeaderComponent} from './header/header.component';
import {FeederComponent} from './feeder/feeder.component';
import {ExplorerComponent} from './explorer/explorer.component';
import {AuthenticationComponent} from './authentication/authentication.component';
import {AuthenticationService} from './authentication/service';
import {AccountDto} from './authentication/account.dto';
import {SessionDto} from './authentication/session.dto.ts';
import {Subscription} from 'rxjs/Subscription';
import {TaskDto} from './common/operator/task.dto';
import {AdminComponent} from './admin/admin.component';
import {Modal} from './common/modal/providers/modal';
import 'rxjs/add/operator/map';


@Component({
    selector: 'portal-root',
    templateUrl: 'app/root.component.html',
    directives: [ROUTER_DIRECTIVES, HomeComponent, HeaderComponent, FeederComponent, AuthenticationComponent, NgClass, NgStyle],
    providers: [AuthenticationService, Modal, ElementRef],
    encapsulation: ViewEncapsulation.None
})

@RouteConfig([
    { path: '/home', as: 'Home', component: HomeComponent, useAsDefault: true },
    { path: '/authentication/...', as: 'Authentication', component: AuthenticationComponent },
    { path: '/admin/...', as: 'Admin', component: AdminComponent },
    { path: '/explorer', as: 'Explorer', component: ExplorerComponent }
])


export class RootComponent implements OnInit, OnDestroy {

    public static LogoHeight: number = 50;

    public isStuck: boolean;

    private _session: SessionDto;
    private _account: AccountDto;
    private _accountSubscription: Subscription = null;
    private _sessionSubscription: Subscription = null;

    constructor(private _authenticationService: AuthenticationService, private _router: Router) {
        this._accountSubscription = _authenticationService.account$.subscribe(account => this.onNewAccount(account));
        this._sessionSubscription = _authenticationService.session$.subscribe(session => this.onNewSession(session));
    }

    ngOnInit() {
        console.log('RootComponent.ngOnInit');
        // this._router.navigate(['Authentication']);
    }

    ngOnDestroy() {
        this.releaseSubscription(this._accountSubscription);
        this._accountSubscription = null;

        this.releaseSubscription(this._sessionSubscription);
        this._sessionSubscription = null;

        console.log('RootComponent.ngOnDestroy');
    }

    public onScroll(event) {
        let currentScrollValue =
            event.currentTarget.scrollY ?
                event.currentTarget.scrollY : event.currentTarget.pageYOffset;

        if (!currentScrollValue) {
            currentScrollValue = 0;
        }
        this.isStuck = (currentScrollValue > RootComponent.LogoHeight);
    }

    private onNewSession(session) {
        this._session = session;
        if (this._session && this._session.account)
            this._router.navigate(['Home']);
        else
            this._router.navigate(['Authentication']);
        //console.log('header.onNewSession: ' + JSON.stringify(this.session));
    }

    private onNewAccount(account: AccountDto) {
        this._account = account;
        //console.log('RootComponent. New Account: ' + JSON.stringify(account));
    }

    private releaseSubscription(subscription: Subscription){
        if (subscription) {
            subscription.unsubscribe();
        }
    }
}
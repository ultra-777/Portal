/**
 * Created by aeb10 on 24.03.2016.
 */
import {Component, OnInit, Input, OnChanges, OnDestroy, HostListener, ViewEncapsulation} from 'angular2/core';
import {CORE_DIRECTIVES, FORM_DIRECTIVES} from 'angular2/common';
import {DROPDOWN_DIRECTIVES} from 'ng2-bootstrap/ng2-bootstrap';
import {Router} from 'angular2/router';
import {AuthenticationService} from '../authentication/service';
import {Subscription} from 'rxjs/Subscription';
import {SessionDto} from '../authentication/session.dto.ts';
import {AccountDto} from '../authentication/account.dto.ts';

@Component({
    selector: 'feeder',
    templateUrl: 'feeder.component.html',
    directives: [CORE_DIRECTIVES, DROPDOWN_DIRECTIVES, FORM_DIRECTIVES],
    encapsulation: ViewEncapsulation.None,
    moduleId: module.id
})

export class FeederComponent implements OnInit, OnDestroy, OnChanges {

    private _accountSubscription:Subscription = null;
    private _sessionSubscription:Subscription = null;
    public items: Array<string>;
    public account:AccountDto;
    public session:SessionDto;
    public scrollY : number;


    constructor(private _authenticationService:AuthenticationService, private _router:Router) {
        let items = [];
        for (let i = 0; i < 5; i++)
            items[i] = 'Item #' + i;
        this.items = items;
        this.scrollY = 0;
    }

    ngOnInit() {
        this._accountSubscription = this._authenticationService.account$.subscribe(account => this.onNewAccount(account));
        this._sessionSubscription = this._authenticationService.session$.subscribe(session => this.onNewSession(session));


    }

    ngOnDestroy() {
        this.releaseSubscription(this._accountSubscription);
        this._accountSubscription = null;

        this.releaseSubscription(this._sessionSubscription);
        this._sessionSubscription = null;
    }

    ngOnChanges(changes) {
        console.log(changes);
    }

    public onScroll(event) {
        let currentScrollValue =
            event.currentTarget.scrollY ?
                event.currentTarget.scrollY : event.currentTarget.pageYOffset;

        if (!currentScrollValue) {
            currentScrollValue = 0;
        }

        this.scrollY = currentScrollValue;
        // console.log('on scroll: ' + currentScrollValue);
    }


    private onNewAccount(account) {
        this.account = account;
        //console.log('header.onNewAccount: ' + JSON.stringify(this.account));
    }


    private onNewSession(session) {
        this.session = session;
        //console.log('header.onNewSession: ' + JSON.stringify(this.session));
    }

    private releaseSubscription(subscription:Subscription) {
        if (subscription) {
            subscription.unsubscribe();
        }
    }
}

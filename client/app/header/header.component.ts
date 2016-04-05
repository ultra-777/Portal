import {Component, OnInit, OnDestroy, ViewEncapsulation} from 'angular2/core';
import {CORE_DIRECTIVES} from 'angular2/common';
import {DROPDOWN_DIRECTIVES} from 'ng2-bootstrap/ng2-bootstrap';
import {Router} from 'angular2/router';
import {AuthenticationService} from '../authentication/service';
import {Subscription} from 'rxjs/Subscription';
import {SessionDto} from '../authentication/session.dto.ts';
import {AccountDto} from '../authentication/account.dto.ts';

@Component({
    selector: 'header',
    templateUrl: 'header.component.html',
    directives: [CORE_DIRECTIVES, DROPDOWN_DIRECTIVES],
    encapsulation: ViewEncapsulation.None,
    moduleId: module.id
})

export class HeaderComponent implements OnInit, OnDestroy {

    private _accountSubscription: Subscription = null;
    private _sessionSubscription: Subscription = null;
    public account: AccountDto;
    public session: SessionDto;
    public isAdmin: boolean;

    constructor(private _authenticationService: AuthenticationService, private _router: Router) {
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

    public signOut() {
        var promise = this._authenticationService.Signout();
        promise.then((result) => {
           if (result.succeeded)
               this._router.navigate(['Authentication/Signin']);
        });
    }

    public signIn() {
        this._router.navigate(['Authentication/Signin']);
    }

    public signUp() {
        this._router.navigate(['Authentication/Signup']);
    }

    public admin(){
        this._router.navigate(['Admin']);
    }

    public explorer(){
        this._router.navigate(['Explorer']);
    }

    private onNewAccount(account) {
        this.account = account;
        let isAdmin = false;
        let roles = this.account ? this.account.roles : [];
        if (roles && roles.length){
            for (let r = 0; r < roles.length; r++) {
                if (roles[r].name == 'admin'){
                    isAdmin = true;
                    break;
                }
            }
        }
        this.isAdmin = isAdmin;
        //console.log('header.onNewAccount: ' + JSON.stringify(this.account));
    }

    private onNewSession(session) {
        this.session = session;
        //console.log('header.onNewSession: ' + JSON.stringify(this.session));
    }

    private releaseSubscription(subscription: Subscription){
        if (subscription) {
            subscription.unsubscribe();
        }
    }
}
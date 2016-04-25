import {Component, OnInit, OnDestroy, ViewEncapsulation} from 'angular2/core';
import {RouteConfig, Router, ROUTER_DIRECTIVES} from 'angular2/router';
import {AuthenticationService} from './service';
import {SigninComponent} from './signin.component';
import {SignupComponent} from './signup.component';
import {SessionDto} from './session.dto.ts';
import {AccountDto} from './account.dto.ts';
import {Subscription} from 'rxjs/Subscription';
import 'rxjs/add/operator/map';



@Component({
    selector: 'authenticaton',
    templateUrl: 'app/authentication/authentication.component.html',
    directives: [ROUTER_DIRECTIVES, SigninComponent],
    providers: [AuthenticationService],
    encapsulation: ViewEncapsulation.None
})

@RouteConfig([
    { path: '/signin', as: 'Signin', component: SigninComponent, useAsDefault: true },
    { path: '/signup', as: 'Signup', component: SignupComponent }
])


export class AuthenticationComponent implements OnInit, OnDestroy {

    private _accountSubcription: Subscription = null;

    constructor(private _authenticationService: AuthenticationService, private _router: Router) {
        this._accountSubcription = _authenticationService.account$.subscribe(account => this.onNewAccount(account));
    }

    ngOnInit() {
        console.log('AuthenticationComponent.ngOnInit');
        this._router.navigate(['Signin']);
    }

    ngOnDestroy() {
        console.log('AuthenticationComponent.ngOnDestroy');
        if (this._accountSubcription) {
            this._accountSubcription.unsubscribe();
            this._accountSubcription = null;
        }
    }

    private onNewAccount(newAccount: AccountDto) {
        //console.log('AuthenticationComponent. New Account: ' + JSON.stringify(newAccount));
    }
}
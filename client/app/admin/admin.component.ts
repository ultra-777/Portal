﻿import {Component, OnInit, OnDestroy, ViewEncapsulation} from 'angular2/core';
import {RouteConfig, Router, ROUTER_DIRECTIVES} from 'angular2/router';
import {AuthenticationService} from '../authentication/service';
import {AccountDto} from '../authentication/account.dto.ts';
import {Subscription} from 'rxjs/Subscription';
import 'rxjs/add/operator/map';
import {UpdateComponent} from "./update/update.component";
import {RepositoryComponent} from "./repository/repository.component";



@Component({
    selector: 'authenticaton',
    templateUrl: 'app/admin/admin.component.html',
    directives: [ROUTER_DIRECTIVES],
    providers: [AuthenticationService],
    encapsulation: ViewEncapsulation.None
})

@RouteConfig([
    { path: '/update', as: 'Update', component: UpdateComponent },
    { path: '/repository', as: 'Repository', component: RepositoryComponent, useAsDefault: true }
])

export class AdminComponent implements OnInit, OnDestroy {

    private _accountSubcription: Subscription = null;

    constructor(private _authenticationService: AuthenticationService, private _router: Router) {
        this._accountSubcription = _authenticationService.account$.subscribe(account => this.onNewAccount(account));
    }

    ngOnInit() {
        console.log('AdminComponent.ngOnInit');
    }

    ngOnDestroy() {
        console.log('AuthenticationComponent.ngOnDestroy');
        if (this._accountSubcription) {
            this._accountSubcription.unsubscribe();
            this._accountSubcription = null;
        }
    }

    private onNewAccount(newAccount: AccountDto) {
        //console.log('AdminComponent. New Account: ' + JSON.stringify(newAccount));
    }
}
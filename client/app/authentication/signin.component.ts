import {Component, ViewEncapsulation} from 'angular2/core';
import {CORE_DIRECTIVES, NgIf} from 'angular2/common';
import {RouteConfig, Router, ROUTER_DIRECTIVES} from 'angular2/router';
import {AuthenticationService} from './service';
import {MessageBoxService} from '../common/message-box/message-box.service';

@Component({
    selector: 'signin',
    templateUrl: 'signin.component.html',
    directives: [CORE_DIRECTIVES, ROUTER_DIRECTIVES],
    providers: [MessageBoxService],
    encapsulation: ViewEncapsulation.None,
    moduleId: module.id
})

export class SigninComponent {
    public result: boolean;
    public resultDate: Date;
    public login: string;
    public password: string;
    public error: string;

    constructor(private _messageBox: MessageBoxService, private _authenticationService: AuthenticationService, private _router: Router) {
        this.resultDate = new Date(2016, 4, 7);
    }

    public OnSignup(): void {
        this._router.navigate(['Signup']);
    }

    public OnSubmit(): void {
        this.error = null;
        let promise =
        this._authenticationService.Signin(
            this.login,
            this.password);

        promise.then((resultPromise) => {
            if (resultPromise.succeeded)
                this._router.parent.navigate(['Home']);
            else
                this.error = resultPromise.message;
        });

    }
}
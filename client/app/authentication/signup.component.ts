import {Component, ViewEncapsulation} from 'angular2/core';
import {CORE_DIRECTIVES, NgIf} from 'angular2/common';
import {Router, ROUTER_DIRECTIVES} from 'angular2/router';
import {AuthenticationService} from './service';
import {MessageBoxService} from '../common/message-box/message-box.service';

@Component({
    selector: 'signup',
    templateUrl: 'signup.component.html',
    directives: [CORE_DIRECTIVES, ROUTER_DIRECTIVES],
    providers: [MessageBoxService],
    encapsulation: ViewEncapsulation.None,
    moduleId: module.id
})



export class SignupComponent {
    public result: boolean;
    public resultDate: Date;
    public login: string;
    public password: string;
    public firstName: string;
    public lastName: string;
    public email: string;
    public error: string;

    constructor(private _messageBox: MessageBoxService, private _authenticationService: AuthenticationService, private _router: Router) {
        this.resultDate = new Date(2016, 4, 7);
    }

    public OnSignin(): void {
        this._router.navigate(['Signin']);
        /*
        this._authenticationService.Signin().then((result) => {
            this._messageBox.showOk(JSON.stringify(result)).then((result) => {
                this._router.navigate(['Home']);
            });
        });
    */
    }

    public OnSubmit(): void {
        let promise =
            this._authenticationService.Signup(
                this.login,
                this.password,
                this.email,
                this.firstName,
                this.lastName);

        promise.then((resultPromise) => {
            if (resultPromise.succeeded)
                this._router.parent.navigate(['Home']);
            else
                this.error = resultPromise.message;
        });

    }
}
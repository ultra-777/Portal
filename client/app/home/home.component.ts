import {Component, OnInit, OnDestroy, ViewEncapsulation} from 'angular2/core';
import {CORE_DIRECTIVES} from 'angular2/common';
import {RouteConfig, Router, ROUTER_DIRECTIVES} from 'angular2/router';
import {AuthenticationService} from '../authentication/service';
import {AccountDto} from '../common/operator/account.dto';
import {Subscription} from 'rxjs/Subscription';

//import {MessageBoxService} from '../common/message-box/message-box.service';
//import {DateTimeEditorDialogService} from '../common/date-time/date-time.editor.dialog.service'

@Component({
    selector: 'home',
    templateUrl: 'app/home/home.component.html',
    directives: [CORE_DIRECTIVES, ROUTER_DIRECTIVES],
    //providers: [DateTimeEditorDialogService, MessageBoxService],
    encapsulation: ViewEncapsulation.None
})

/*
@RouteConfig([

])
*/

export class HomeComponent implements OnInit, OnDestroy {
    public result: boolean;
    public resultDate: Date;
    public account: AccountDto;
    private _accountSubcription: Subscription = null;

    constructor(private _authenticationService: AuthenticationService/*private _messageBox: MessageBoxService, private _dateTime: DateTimeEditorDialogService*/) {
        this.resultDate = new Date(2016, 4, 7);
    }

    onMessage() {
        //var resultPromise = this._messageBox.showYesNoCancel("Cheers", "Qwerty");
        //resultPromise.then((result) => {
        //    this.result = result;
        //});
    }

    onDate() {
        //var resultPromise = this._dateTime.show(this.resultDate);
        //resultPromise.then((result) => {
        //    this.resultDate = result;
        //});
    }

    ngOnInit() {
        //this._accountSubcription = this._operatorService.account$.subscribe(account => this.onNewAccount(account));
        this._accountSubcription = this._authenticationService.account$.subscribe(account => this.onNewAccount(account));
    }

    ngOnDestroy() {
        if (this._accountSubcription) {
            this._accountSubcription.unsubscribe();
            this._accountSubcription = null;
        }
    }

    onNewAccount(account) {
        this.account = account;
        //console.log('home.onNewAccount: ' + JSON.stringify(this.account));
    }
}
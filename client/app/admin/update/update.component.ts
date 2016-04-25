/**
 * Created by Andrey on 10.04.2016.
 */
import {Component, OnInit, OnDestroy, ViewEncapsulation} from 'angular2/core';
import {RouteConfig, Router, ROUTER_DIRECTIVES} from 'angular2/router';

import {UpdateService} from './service';
import {ResultImpl} from "../../common/result-impl";
import {MessageBoxService} from "../../common/message-box/message-box.service";




@Component({
    selector: 'admin-update',
    templateUrl: 'app/admin/update/update.component.html',
    directives: [],
    providers: [ROUTER_DIRECTIVES, UpdateService, MessageBoxService],
    pipes:[],
    encapsulation: ViewEncapsulation.None
})

export class UpdateComponent implements OnInit, OnDestroy {

    public callTrace: string;

    constructor(private _service: UpdateService, private _messageBox: MessageBoxService) {

    }

    public ngOnInit() {
        console.log('UpdateComponent.ngOnInit');
    }

    public ngOnDestroy() {
        console.log('UpdateComponent.ngOnDestroy');
    }

    public pull () {
        this.handleResult(this._service.pull(), 'pull');
    };

    public install () {
        this.handleResult(this._service.install(), 'install');
    };

    public build () {
        this.handleResult(this._service.build(), 'build');
    };

    public restart () {
        this.handleResult(this._service.restart(), 'restart');
    };

    public reboot () {
        this.handleResult(this._service.reboot(), 'reboot');
    };

    private handleResult(callResult: Promise<ResultImpl<string>>, title: string){
        let local = this;
        local.callTrace = null;
        callResult.then(result => {
            if (result.succeeded)
                local.callTrace = result.data;
            else {
                local._messageBox.showOk(result.message, title);
            }
        })
    }
}


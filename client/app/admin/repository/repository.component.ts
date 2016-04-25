/**
 * Created by Andrey on 11.04.2016.
 */
import {Component, OnInit, OnDestroy, ViewEncapsulation} from 'angular2/core';
import {RouteConfig, Router, ROUTER_DIRECTIVES} from 'angular2/router';

import {RepositoryService} from './service';
import {ResultImpl} from "../../common/result-impl";
import {MessageBoxService} from "../../common/message-box/message-box.service";
import {RepositoryItem} from "./repository-item";




@Component({
    selector: 'admin-repository',
    templateUrl: 'app/admin/repository/repository.component.html',
    directives: [],
    providers: [ROUTER_DIRECTIVES, RepositoryService, MessageBoxService],
    pipes:[],
    encapsulation: ViewEncapsulation.None
})

export class RepositoryComponent implements OnInit, OnDestroy {

    public current: RepositoryItem;
    public repositories: Array<RepositoryItem>;

    constructor(private _messageBox: MessageBoxService) {

    }

    public ngOnInit() {
        this.loadRepositories();
        console.log('UpdateComponent.ngOnInit');
    }

    public ngOnDestroy() {
        console.log('UpdateComponent.ngOnDestroy');
    }

    public onItem(item: RepositoryItem){
        let toSelect = !item.isSelected;
        let targetRepository = null;
        for (let key in this.repositories){
            let repository = this.repositories[key];
            if (toSelect) {
                var isSelected = (item.id == repository.id);
                repository.isSelected = isSelected;
                if (isSelected)
                    targetRepository = repository;
            }
            else
                repository.isSelected = false;
        }

        if (this.current && this.current !== targetRepository)
            this.current.cancel();
        this.current = targetRepository;
    }

    public add(){
        this.current = new RepositoryItem(null);
    }

    public cancel(){
        this.current = null;
    }

    public save(){
        if (this.current){
            let local = this;
            this.current.save().then(result => {
               if (result.succeeded){
                   let index = local.repositories.indexOf(local.current);
                   if (index < 0) {
                       local.repositories.push(local.current);
                       local.onItem(local.current);
                   }
               }
                else {
                   local._messageBox.showOk(result.message, 'Saving failed');
               }
            });
        }
    }

    public remove(){
        if (this.current) {
            if (this.current.id) {
                let local = this;
                let id = this.current.id;
                RepositoryService.removeRepository(id).then(result => {
                        if (result.succeeded) {
                            for (var i = 0; i < local.repositories.length; i++)
                                if (local.repositories[i].id == id) {
                                    local.repositories.splice(i, 1);
                                    local.current = null;
                                    break;
                                }
                        }
                        else {
                            this._messageBox.showOk(result.message, 'Removing failed');
                        }
                    });
            }
            else
                this.current = null;
        }
    }

    private loadRepositories(){
        let local = this;
        RepositoryService.findRepositories()
            .then(result => {
                if (result.succeeded)
                    local.repositories = result.data;
                else {
                    local._messageBox.showOk(result.message, 'Loading failed');
                }
            });
    }
}



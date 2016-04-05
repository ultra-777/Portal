/**
 * Created by Andrey on 27.03.2016.
 */
import {Component, OnInit, OnDestroy, ViewEncapsulation} from 'angular2/core';
import {Subscription} from 'rxjs/Subscription';
import 'rxjs/add/operator/map';

import {ExplorerService} from './service';
import {Node} from './node';
import {FolderNodeComponent} from './folder-node.component';
import {OrderNodesByNamePipe} from "./node-order-by-name.pipe";
import {FileNodeComponent} from "./file-node.component";
import {BytesPipe} from "./bytes-pipe";



@Component({
    selector: 'explorer',
    templateUrl: 'explorer.component.html',
    directives: [FolderNodeComponent, FileNodeComponent],
    providers: [ExplorerService],
    pipes:[OrderNodesByNamePipe, BytesPipe],
    encapsulation: ViewEncapsulation.None,
    moduleId: module.id
})

export class ExplorerComponent implements OnInit, OnDestroy {

    public outParam: number;
    private _inParam: number;

    public nodePromise: Promise<Node> = null;
    public current: Node = null;

    constructor(private _explorerService: ExplorerService) {

        this.nodePromise = new Promise<Node>(resolve => {
            _explorerService.getRoot().then(function (result) {
                if (result.succeeded) {
                    let rootNode = new Node(result.data.id, result.data.name);
                    resolve(rootNode);
                }
                else{
                    resolve(null);
                }
            });
        });
    }

    ngOnInit() {
        console.log('ExplorerComponent.ngOnInit');
        this.outParam = 99;
    }

    ngOnDestroy() {
        console.log('ExplorerComponent.ngOnDestroy');
    }

    public set inParam(newValue: number){
        if (this._inParam != newValue) {
            this._inParam = newValue;
            console.log('ExplorerComponent.inParam: ' + this._inParam);
        }
    };
    public get inParam() : number{
        return this._inParam;
    };

    public onInputParam(event){
        // console.log('ExplorerComponent.onInputParam: ' + JSON.stringify(event));
    }

    public onNodeSelected(node){
        this.current = node;
        console.log('ExplorerComponent.onNodeSelected: ' + (node ? (node.id + ': ' + node.name) : 'none'));
    }
}

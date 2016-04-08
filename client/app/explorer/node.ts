/**
 * Created by Andrey on 27.03.2016.
 */
import {ExplorerService} from './service';
import {Injector} from 'angular2/src/core/di';

import {Observable} from 'rxjs/Observable';
import {ReplaySubject} from 'rxjs/subject/ReplaySubject';
import 'rxjs/add/operator/publishReplay';
import {UploadHandler} from "./upload-handler";
import {ResultImpl} from "../common/result-impl";
import {NodeDto} from "./node.dto";

export class Node {

    public id: number;
    public parent: Node;
    public containers: Array<Node> = null;
    public leafs: Array<Node> = null;
    public isContainer: boolean;
    public name: string;
    public extension: string;
    public size: number;
    public created: Date;
    public lastError: any;
    public nodePromise: Promise<Node>;

    public selectedNode$: Observable<Node>;
    private _selectedNodeObserver: ReplaySubject<Node>;

    private _isExpanded: boolean = false;
    private _isLoaded: boolean = false;
    private _isSelected: boolean = false;
    private _selectedNode: Node = null;
    private _selectedLeaf: Node = null;
    private isWaiting = true;

    private static _service: ExplorerService;

    constructor(id: number, name: string = null, parent: Node = null) {

        if (!Node._service){
            let injector = Injector.resolveAndCreate([ExplorerService]);
            Node._service = injector.get(ExplorerService);
        }

        this._selectedNodeObserver = new ReplaySubject<Node>(1);
        this.selectedNode$ = this._selectedNodeObserver;

        this.id = id;
        this.name = name;
        this.parent = parent;

        this.nodePromise = new Promise<Node>(resolve => {
            resolve(this);
        });

        if (!parent || parent.isExpanded)
            this.load();
    }

    get isRoot(){
        return this.parent ? false : true;
    }

    get selectedNode() : Node {
        return this._selectedNode;
    }

    set selectedNode(newValue: Node) {
        if (this._selectedNode != newValue){
            this._selectedNode = newValue;
            this._selectedNodeObserver.next(this._selectedNode);
        }
    }

    get selectedLeaf() : Node {
        return this._selectedLeaf;
    }

    set selectedLeaf(newValue: Node) {
        if (this._selectedLeaf != newValue){
            this._selectedLeaf = newValue;
            if (!this._selectedLeaf) {
                for (let key in this.leafs) {
                    let leaf = this.leafs[key];
                    leaf.isSelected = false;
                }
            }
        }
    }

    get isExpanded(): boolean{
        return this._isExpanded;
    }

    set isExpanded(newValue: boolean){
        if (this._isExpanded != newValue){
            if (newValue){
                if (!this.isContainer)
                    return;

                if (this.containers){
                    var promises = [];
                    for (let key in this.containers){
                        let container = this.containers[key];
                        promises.push(container.load());
                    }

                    Promise.all(promises).then(function(results) {

                        }, function(error){

                        });
                }
            }
            this._isExpanded = newValue;
        }
    }

    get isSelected(){
        return this._isSelected;
    }
    set isSelected(newValue){
        if (this._isSelected != newValue){
            if (this.isContainer) {
                let root = this.getRoot();
                if (newValue) {
                    this._isSelected = true;
                    let currentSelectedNode = root.selectedNode;

                    root.selectedNode = this;

                    if (currentSelectedNode && (currentSelectedNode !== this)) {
                        currentSelectedNode.isSelected = false;
                    }


                    var promises = [];
                    for (let key in this.leafs) {
                        let leaf = this.leafs[key];
                        promises.push(leaf.load());
                    }

                    Promise.all(promises).then(function (results) {

                    }, function (error) {

                    });
                }
                //else if (root.selectedNode === this)
                //    root.selectedNode = null;
                else if (root.selectedNode !== this) {
                    this._isSelected = false;
                }

                if (!this._isSelected) {
                    this.selectedLeaf = null;
                }
            }
            else {
                let root = this.parent;
                if (newValue) {
                    this._isSelected = true;
                    let currentSelectedLeaf = root.selectedLeaf;

                    root.selectedLeaf = this;

                    if (currentSelectedLeaf && (currentSelectedLeaf !== this)) {
                        currentSelectedLeaf.isSelected = false;
                    }
                }
                //else if (root.selectedNode === this)
                //    root.selectedNode = null;
                else if (root.selectedLeaf !== this)
                    this._isSelected = false;
            }
        }
    }

    moveChild(newChild: Node): Promise<any>{
        var local = this;

        return new Promise<any>(resolve => {

            Node._service.moveChild(local.id, newChild.id).then(function (result) {
                if (result.succeeded){
                    if (newChild.parent) {
                        let isLeafSelectionRequired = !newChild.isContainer && newChild.isSelected;
                        let sourceOwnerCollection =
                            newChild.isContainer ?
                                newChild.parent.containers : newChild.parent.leafs;
                        let dropResult = Node.dropCollectionChild(sourceOwnerCollection, newChild);
                        if (dropResult) {
                            let targetOwnerCollection =
                                newChild.isContainer ?
                                    local.containers : local.leafs;
                            targetOwnerCollection.push(newChild);

                            newChild.parent = local;
                            if (newChild.isContainer)
                                newChild.isSelected = true;
                            else {
                                local.isSelected = true;
                                if (isLeafSelectionRequired)
                                    local.selectedLeaf = newChild;
                            }

                            if (!local.isExpanded)
                                local.isExpanded = true;
                        }
                    }
                    resolve(null);
                }
                else{
                    resolve(result.message);
                }

            });
        });
    }

    drop(): Promise<any>{
        var local = this;
        return new Promise<any>(resolve => {

            Node._service.delete(local.id).then(function (result) {
                if (result.succeeded) {
                    let parent = local.parent;
                    if (parent) {
                        if (local.isContainer) {
                            if (parent.containers) {
                                Node.dropCollectionChild(parent.containers, local);
                            }
                        }
                        else {
                            if (parent.leafs) {
                                Node.dropCollectionChild(parent.leafs, local);
                            }
                        }
                    }

                    resolve(null);
                }
                else {
                    resolve(result.message);
                }
                ;

            });
        });
    }

    load(): Promise<Node>{

        var local = this;
        return new Promise<Node>(resolve => {

            if (local._isLoaded)
                resolve(this);
            else {
                local.isWaiting = true;
                Node._service.getNode(local.id)
                    .then(function (result) {
                        if (result.succeeded) {
                            let nodeData = result.data;
                            local.isContainer = nodeData.isContainer;
                            local.name = nodeData.name;

                            if (nodeData.isContainer) {
                                var subfolders = [];
                                var files = [];
                                if (nodeData.children) {
                                    for (let key in nodeData.children) {
                                        let child = nodeData.children[key];
                                        let childNode = new Node(child.id, child.name, local);
                                        if (child.isContainer) {
                                            subfolders.push(childNode);
                                        }
                                        else {
                                            files.push(childNode);
                                        }
                                    }
                                }
                                local.containers = subfolders;
                                local.leafs = files;
                            }
                            else {
                                local.size = nodeData.size;
                                local.extension = nodeData.extension;
                                if (nodeData.created)
                                    local.created = new Date(nodeData.created);
                            }
                            local._isLoaded = true;
                            local.isWaiting = false;
                            resolve(local);
                        }
                        else {
                            local.isWaiting = false;
                            local._isLoaded = true;
                            local.lastError = result.message;
                            resolve(local);
                        }
                    });
            }
        });
    }

    loadContainers(): Promise<boolean>{
        let local = this;
        return new Promise<boolean>(resolve => {
            if (this.containers) {
                var promises = [];
                for (let key in local.containers){
                    let subfolder = local.containers[key];
                    promises.push(subfolder.load());
                }
                Promise.all(promises).then(function (results) {
                        resolve(true);
                    }, function (error) {
                        resolve(false);
                    });
            }
        });
    }

    loadLeafs(): Promise<boolean>{
        let local = this;
        return new Promise<boolean>(resolve => {
            if (local.leafs) {
                var promises = [];
                for (let key in local.leafs){
                    let file = local.leafs[key];
                    promises.push(file.load());
                }
                Promise.all(promises)
                    .then(function (results) {
                        resolve(true);
                    }, function (error) {
                        resolve(false);
                    });
            }
        });
    }

    addContainer(newFolderName: string): Promise<any>{
        var local = this;
        return new Promise<any>(resolve => {

            Node._service.newFolder(local.id, newFolderName).then(function (result){
                if (result.succeeded){
                    let newFolderInfo = result.data;
                    if (!local.containers)
                        local.containers = [];

                    var newNode = new Node(newFolderInfo.id, newFolderInfo.name, local);
                    newNode.isContainer = true;
                    local.containers.push(newNode);
                    newNode.isSelected = true;

                    if (!local.isExpanded)
                        local.isExpanded = true;

                    resolve(null);
                }
                else{
                    resolve(result.message);
                }
            });
        });
    }

    addLeaf(file: File, name: string = null): UploadHandler{
        let local = this;
        let uploader = UploadHandler.transfer(file, local.id, name);
        uploader.result.then((result: ResultImpl<NodeDto>) => {
            if (result.succeeded) {
                let newNode = new Node(result.data.id, result.data.name, local);
                local.leafs.push(newNode);
                newNode.load();
            }
        });
        return uploader;
    }

    rename(newName: string): Promise<any>{

        var local = this;
        return new Promise<any>(resolve => {

            Node._service.rename(local.id, newName).then(function (result) {
                if (result.succeeded){
                    if (result.data) {
                        local.name = newName;
                    }
                    resolve(null);
                }
                else{
                    resolve(result.message);
                }
            });
        });
    }

    getRoot (): Node{
        let root = <Node>this;
        let parent = this.parent;
        while (parent){
            root = parent;
            parent = parent.parent;
        }
        return root;
    }

    iterateAncestors(checkSelf: boolean, iterator/*bool function(node, level)*/){
        var level = 0;
        if (checkSelf && iterator(this, level))
            return;
        var parent = this.parent;
        while (parent){
            level = level + 1;
            if (iterator(parent, level))
                return;
            parent = parent.parent;
        }
    }

    refresh() {
        this.containers = Node.cloneArray(this.containers);
        this.leafs = Node.cloneArray(this.leafs);
    }

    refreshParent() {
        if (this.parent){
            this.parent.containers = Node.cloneArray(this.parent.containers);
            this.parent.leafs = Node.cloneArray(this.parent.leafs);
        }
    }

    getNeighbourNames(){
        let neighbours = [];
        if (this.parent){
            if (this.parent.containers)
                this.fillSiblingNames(neighbours, this.parent.containers);
            if (this.parent.leafs)
                this.fillSiblingNames(neighbours, this.parent.leafs);
        }
        return neighbours;
    }

    getChildrenNames(){
        let children = [];
        if (this.containers)
            this.fillSiblingNames(children, this.containers);
        if (this.leafs)
            this.fillSiblingNames(children, this.leafs);

        return children;
    }

    private static cloneArray(source: Array<Node>) : Array<Node>{
        if (!source)
            return null;
        let result = [];
        for (let key in source) {
            let item = source[key];
            if (item)
                result.push(item);
        }
        return result;
    }

    private fillSiblingNames(siblings: Array<string>, source: Array<Node>, skipCurrent: boolean = true){
        if (!siblings)
            return;
        if (source) {
            for (let key in source) {
                let sibling = source[key];
                if (skipCurrent && (sibling === this))
                    continue;
                if (sibling.name)
                    siblings.push(sibling.name.toLowerCase());
            }
        }
    }

    private static dropCollectionChild(collection: Array<Node>, target: Node){
        var targetIndex = -1;
        for (var i = 0; i < collection.length; i++){
            var candidate = collection[i];
            if (candidate === target){
                targetIndex = i;
                break;
            }
        }
        if (targetIndex > -1) {
            collection.splice(targetIndex, 1);
            target.parent = null;
            return true;
        }
        return false;
    }

    private static compareChildren (a: Node, b: Node): number {
        if (a.name.toLowerCase() < b.name.toLowerCase())
            return -1;
        if (a.name.toLowerCase() > b.name.toLowerCase())
            return 1;
        return 0;
    }
}

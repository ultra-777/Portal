/// <reference path="../../typings/tsd.d.ts"/> 
/// <reference path="../../node_modules/angular2/typings/browser.d.ts"/>
/// <reference path="../../node_modules/angular2/typings/es6-promise/es6-promise.d.ts"/>;
 
import {bootstrap}    from 'angular2/platform/browser'
import {provide, Renderer, enableProdMode} from 'angular2/core';
import {ROUTER_PROVIDERS, LocationStrategy, HashLocationStrategy} from 'angular2/router';
import {HTTP_PROVIDERS} from 'angular2/http';
import {ELEMENT_PROBE_PROVIDERS} from 'angular2/platform/common_dom';
import {RootComponent} from  './root.component';
import {Modal} from './common/modal/providers/modal';
import {ModalConfig} from './common/modal/models/modal-config';

enableProdMode();

bootstrap(RootComponent, [
    ROUTER_PROVIDERS,
    HTTP_PROVIDERS,
    Renderer
]).then(
    success => console.log('bootstrap.ok'),
    error => console.log('bootstrap.failure: ' + error)
    );
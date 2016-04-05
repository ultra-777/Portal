import {Component, Input, Injector, Injectable, IterableDiffers, KeyValueDiffers, Renderer, provide, ElementRef, ViewEncapsulation} from 'angular2/core';
import {CORE_DIRECTIVES} from 'angular2/common';
import * as moment from 'moment';
import {DATEPICKER_DIRECTIVES, Timepicker} from 'ng2-bootstrap/ng2-bootstrap';

import {ModalConfig} from '../modal/models/modal-config';
import {Modal} from '../modal/providers/modal';
import {ModalDialogInstance} from '../modal/models/modal-dialog-instance';
import {ICustomModal, ICustomModalComponent} from '../modal/models/custom-modal';


@Component({
    selector: 'date-time-editor-dialog',
    directives: [CORE_DIRECTIVES, DATEPICKER_DIRECTIVES, Timepicker],
    templateUrl: 'date-time.editor.dialog.component.html',
    encapsulation: ViewEncapsulation.None,
    moduleId: module.id
})
export class DateTimeEditorDialog implements ICustomModalComponent {
    dialog: ModalDialogInstance;
    context: Date;

    public dt: Date = new Date();
    public initialDate: Date = null;
    private minDate: Date = null;
    private events: Array<any>;
    private tomorrow: Date;
    private afterTomorrow: Date;
    private formats: Array<string> = ['DD-MM-YYYY', 'YYYY/MM/DD', 'DD.MM.YYYY', 'shortDate'];
    private format = this.formats[0];
    private dateOptions: any = {
        formatYear: 'YY',
        startingDay: 1
    };
    private opened: boolean = false;

    constructor(dialog: ModalDialogInstance, modelContentData: ICustomModal) {
        this.dialog = dialog;
        this.initialDate = modelContentData ? <Date>modelContentData : null;

        (this.tomorrow = new Date()).setDate(this.tomorrow.getDate() + 1);
        (this.afterTomorrow = new Date()).setDate(this.tomorrow.getDate() + 2);
        (this.minDate = new Date()).setDate(this.minDate.getDate() - 1000);
        this.events = [
            { date: this.tomorrow, status: 'full' },
            { date: this.afterTomorrow, status: 'partially' }
        ];
    }

    public getDate(): number {
        return this.dt && this.dt.getTime() || new Date().getTime();
    }
    private today() {
        this.dt = new Date();
    }

    // todo: implement custom class cases
    private getDayClass(date: any, mode: string) {
        if (mode === 'day') {
            let dayToCheck = new Date(date).setHours(0, 0, 0, 0);

            for (let i = 0; i < this.events.length; i++) {
                let currentDay = new Date(this.events[i].date).setHours(0, 0, 0, 0);

                if (dayToCheck === currentDay) {
                    return this.events[i].status;
                }
            }
        }

        return '';
    }

    private disabled(date: Date, mode: string): boolean {
        return (mode === 'day' && (date.getDay() === 0 || date.getDay() === 6));
    }

    private open() {
        this.opened = !this.opened;
    }

    private clearDate() {
        this.dt = null;
    }

    private toggleMin() {
        this.dt = this.minDate;
    }











    private hstep: number = 1;
    private mstep: number = 15;
    private ismeridian: boolean = false;


    private options: any = {
        hstep: [1, 2, 3],
        mstep: [1, 5, 10, 15, 25, 30]
    };

    private toggleMode(): void {
        this.ismeridian = !this.ismeridian;
    };

















    ok(event): void {
        event.stopPropagation();
        this.dialog.close(this.dt ? new Date(this.dt.getTime()) : null);
    }

    cancel(event) {
        event.stopPropagation();
        this.dialog.close(null);
    }
}

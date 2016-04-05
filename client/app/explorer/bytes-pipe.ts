/**
 * Created by Andrey on 02.04.2016.
 */

import { Pipe, PipeTransform } from "angular2/core";

@Pipe({
    name: "bytes"
})
export class BytesPipe {
    private static _units = ['bytes', 'KB', 'MB', 'GB', 'TB', 'PB'];
    transform(valueCandidate:number, precision: number = 0) : string {

        if (!valueCandidate || isNaN(valueCandidate) || (0 === valueCandidate) || !isFinite(valueCandidate))
            return '-';
        let value = parseInt(valueCandidate.toString());
        if (typeof precision === 'undefined')
            precision = 1;
        let number = Math.floor(Math.log(value) / Math.log(1024));
        return (value / Math.pow(1024, Math.floor(number))).toFixed(precision) + ' ' + BytesPipe._units[number];
    }
}


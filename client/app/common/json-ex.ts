import {Response} from 'angular2/http';
export class JsonEx  {

    public static parse2Lower<T>(text): T {
        let rawData = JSON.parse(text);
        if (!rawData)
            return null;

        return JsonEx.handleMember(rawData);
    }

    private static handleMember(scope, key: string = null): any{

        if (key) {
            if (key.length < 1)
                return null;
            let memberValue = JsonEx.handleMember(scope[key]);
            let lowerKey = key[0].toLowerCase() + key.substring(1);
            if (lowerKey !== key){
                delete scope[key];
            }
            scope[lowerKey] = memberValue;
            return memberValue;
        }
        else {
            if (typeof scope == 'object') {
                for (let memberKey in scope) {
                    JsonEx.handleMember(scope, memberKey);
                }
            }
            return scope;
        }
    }
}

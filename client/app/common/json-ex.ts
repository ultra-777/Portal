import {Response} from 'angular2/http';
export class JsonEx  {

    public static Parse2Lower<T>(text): T {
        let rawData = JSON.parse(text);
        if (!rawData)
            return null;

        return JsonEx.HandleMember(rawData);
    }

    private static HandleMember(scope, key: string = null): any{

        if (key) {
            if (key.length < 1)
                return null;
            let memberValue = JsonEx.HandleMember(scope[key]);
            let lowerKey = key[0].toLowerCase() + key.substring(1);
            if (lowerKey !== key){
                delete scope[key];
            }
            scope[lowerKey] = memberValue;
            return memberValue;
        }
        else {
            if (typeof scope == 'object') {
                for (var memberKey in scope) {
                    JsonEx.HandleMember(scope, memberKey);
                }
            }
            return scope;
        }
    }
}

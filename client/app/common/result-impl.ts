export class ResultImpl<T> {
    constructor(succeeded: boolean, data: T, message: string){
        this.succeeded = succeeded;
        this.data = data;
        this.message = message;
    }

    static success<T>(data: T) : ResultImpl<T> {
        return new ResultImpl<T>(true, data, null);
    };

    static failure<T>(errorMessage) {
        return new ResultImpl<T>(false, null, errorMessage);
    };

    public succeeded: boolean;
    public message: string;
    public data: T;
}
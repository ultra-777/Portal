/**
 * Created by aeb10 on 29.03.2016.
 */
import {SiblingContext} from "./sibling-context";

export class UploadContext extends SiblingContext {
    public name: string;
    constructor(
        neighbourhood: Array<string>
    ) {
        super(neighbourhood);
    }
}

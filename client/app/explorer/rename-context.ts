/**
 * Created by aeb10 on 29.03.2016.
 */
import {SiblingContext} from "./sibling-context";

export class RenameContext extends SiblingContext {
    constructor(
        public original: string = '',
        neighbourhood: Array<string>
    ) {
        super(neighbourhood);
    }
}

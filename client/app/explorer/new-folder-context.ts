/**
 * Created by aeb10 on 29.03.2016.
 */

import {SiblingContext} from "./sibling-context";

export class NewFolderContext extends SiblingContext {

    constructor(
        neighbourhood: Array<string>
    ) {
        super(neighbourhood);
    }
}

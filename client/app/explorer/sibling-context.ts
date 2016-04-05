/**
 * Created by Andrey on 01.04.2016.
 */

import {ModalContext} from '../common/modal/models/modal-context';

export class SiblingContext extends ModalContext {
    constructor(
        public neighbourhood: Array<string>
    ) {
        super();
    }

    public validate(candidate: string) : boolean {
        let candidateHandler = candidate ? candidate.toLowerCase() : null;
        if (candidateHandler){
            if (this.neighbourhood){
                for (let key in this.neighbourhood){
                    let neighbour = this.neighbourhood[key];
                    if (!neighbour)
                        continue;
                    if (neighbour.toLowerCase() == candidateHandler)
                        return false;
                }
            }
            return true;
        }
        else{
            return false;
        }
    }
}

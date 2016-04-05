/**
 * Created by aeb10 on 29.03.2016.
 */
import { Pipe, PipeTransform } from "angular2/core";
import { Node } from './node';

@Pipe({
    name: "orderNodesByName"
})
export class OrderNodesByNamePipe {
    transform(array: Array<Node>, args: string): Array<Node> {
        array.sort((a: Node, b: Node) => {
            if (!a.isContainer && b.isContainer)
                return 1;
            if (a.isContainer && !b.isContainer)
                return -1;

            if ((a.name ? a.name.toLowerCase() : null) < (b.name ? b.name.toLowerCase() : null)) {
                return -1;
            }
            if ((a.name ? a.name.toLowerCase() : null) > (b.name ? b.name.toLowerCase() : null)) {
                return 1;
            }

            if (a.name < b.name) {
                return -1;
            }
            if (a.name > b.name) {
                return 1;
            }

            return 0;

        });
        return array;
    }
}


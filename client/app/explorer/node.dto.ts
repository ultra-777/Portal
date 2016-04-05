/**
 * Created by Andrey on 29.03.2016.
 */
export class NodeDto {
    public id: number;
    public name: string;
    public parent: number;
    public treeId: number;
    public isContainer: boolean;
    public size: number;
    public extension: string;
    public created: string;
    public children: Array<NodeDto>;
}

/**
 * Created by Andrey on 10.04.2016.
 */
export class RepositoryDto{
    public id: number;
    public name: string;
    public location: string;
    public isOpen: boolean;
    public childFilesLimit: number;
    public childFoldersLimit: number;
    public created: string;
}

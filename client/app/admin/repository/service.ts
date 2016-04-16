/**
 * Created by Andrey on 10.04.2016.
 */
import {Injectable} from 'angular2/core';
import {Http, Headers} from 'angular2/http';

import {ResultImpl} from '../../common/result-impl';
import {HttpHandler} from '../../common/http-handler';
import {RepositoryItem} from "./repository-item";
import {RepositoryDto} from "./repository.dto";


@Injectable()
export class RepositoryService {

    private static _controllerPrefix: string = '/repository/';

    constructor() {

    }

    public static removeRepository(id: number): Promise<ResultImpl<boolean>>{
        return new Promise<ResultImpl<boolean>>(resolve => {
            let result = HttpHandler.post<ResultImpl<boolean>>(
                RepositoryService._controllerPrefix + 'delete',
                {
                    id: id
                });
            result.then(exactResult => {
                resolve(exactResult)
            });
        });
    }

    public static findRepositories(name: string = null) : Promise<ResultImpl<Array<RepositoryItem>>> {
        return new Promise<ResultImpl<Array<RepositoryItem>>>(resolve => {
            let rawPromise = HttpHandler.post<ResultImpl<Array<RepositoryDto>>>(
                RepositoryService._controllerPrefix + 'find',
                {
                    name: name
                });
            rawPromise.then(rawResult => {
                let finalResult =
                    rawResult.succeeded ?
                        ResultImpl.success<Array<RepositoryItem>>(
                            rawResult.data ? rawResult.data.map((dto) => {
                                return new RepositoryItem(dto);
                            }) : []) : ResultImpl.failure<Array<RepositoryItem>>(rawResult.message);
                resolve(finalResult);
            });
        });
    }



    public static getRepository(id: number) : Promise<ResultImpl<RepositoryDto>>{

        return HttpHandler.post<ResultImpl<RepositoryDto>>(
                RepositoryService._controllerPrefix + 'get',
                {
                    id: id
                });
    }

    public static updateRepository(instance: RepositoryItem) : Promise<ResultImpl<RepositoryDto>> {
        return (instance.id) ?
                HttpHandler.post<ResultImpl<RepositoryDto>>(
                    RepositoryService._controllerPrefix + 'update',
                    {
                        id: instance.id,
                        name: instance.name,
                        location: instance.location,
                        isOpen: instance.isOpen
                    }
                ) :
                HttpHandler.post<ResultImpl<RepositoryDto>>(
                    RepositoryService._controllerPrefix + 'create',
                    {
                        name: instance.name,
                        location: instance.location,
                        isOpen: instance.isOpen
                    }
                );
    }
}

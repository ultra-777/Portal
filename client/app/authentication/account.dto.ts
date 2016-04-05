/**
 * Created by Andrey on 14.03.2016.
 */
import {RoleDto} from './role.dto.ts';

export class AccountDto {
    public id: number;
    public name: string;
    public firstName: string;
    public lastName: string;
    public email: string;
    public provider: string;
    public updated: Date;
    public created: Date;
    public roles: Array<RoleDto>;
}

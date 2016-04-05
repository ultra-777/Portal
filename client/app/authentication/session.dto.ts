/**
 * Created by Andrey on 14.03.2016.
 */
import {AccountDto} from './account.dto.ts';
import {AgentDto} from './agent.dto.ts';

export class SessionDto {
    public ip: string;
    public isSecure: boolean;
    public account: AccountDto;
    public agent: AgentDto;
}

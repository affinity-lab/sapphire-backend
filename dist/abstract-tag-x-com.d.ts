import { AbstractTagRepository } from "@affinity-lab/blitz";
import { MaybeArray } from "@affinity-lab/util";
import { AuthResolver } from "./interfaces";
import { Request } from "express";
export declare class AbstractTagXCom {
    protected authResolver?: AuthResolver<any> | undefined;
    protected roles?: MaybeArray<string> | undefined;
    protected repository: AbstractTagRepository;
    constructor(authResolver?: AuthResolver<any> | undefined, roles?: MaybeArray<string> | undefined);
    protected hasRole(req: Request): Promise<boolean>;
    create(args: {
        name: string;
    }, req: Request): Promise<boolean>;
    modify(args: {
        name: string;
        newName: string;
        predefined?: boolean;
    }, req: Request): Promise<boolean>;
    delete(args: {
        name: string;
    }, req: Request): Promise<boolean>;
    get(args: {}, req: Request): Promise<Array<{
        name: string;
        predefined: boolean;
    }>>;
}

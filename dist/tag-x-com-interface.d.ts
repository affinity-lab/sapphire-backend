import { ITagRepository } from "@affinity-lab/blitz";
import { MaybeArray } from "@affinity-lab/util";
import { Request } from "express";
import { AuthResolver } from "./interfaces";
export declare abstract class ITagXCom {
    protected authResolver?: AuthResolver<any> | undefined;
    protected roles?: MaybeArray<string> | undefined;
    protected repository: ITagRepository;
    protected constructor(authResolver?: AuthResolver<any> | undefined, roles?: MaybeArray<string> | undefined);
    protected initialize(): void;
    protected hasRole(req: Request): Promise<boolean>;
    abstract create(args: any, req: Request, ...more: any): Promise<boolean>;
    abstract modify(args: any, req: Request, ...more: any): Promise<boolean>;
    abstract delete(args: any, req: Request, ...more: any): Promise<boolean>;
    abstract get(args: any, req: Request, ...more: any): Promise<Array<any>>;
}

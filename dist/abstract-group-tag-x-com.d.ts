import { ITagXCom } from "./tag-x-com-interface";
import { Request } from "express";
import { MaybePromise } from "@affinity-lab/util";
export declare class AbstractGroupTagXCom extends ITagXCom {
    protected groupIdFunc: (req: Request) => MaybePromise<number>;
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
    get(args: {}, req: Request): Promise<Array<any>>;
}

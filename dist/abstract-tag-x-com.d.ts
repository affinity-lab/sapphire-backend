import { Request } from "express";
import { ITagXCom } from "./tag-x-com-interface";
export declare class AbstractTagXCom extends ITagXCom {
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

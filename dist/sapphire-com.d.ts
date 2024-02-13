import { IForm } from "./form";
import { IList } from "./list";
import { AuthResolver } from "./interfaces";
import { Files } from "@affinity-lab/x-com";
import { Request } from "express";
import { TmpFile } from "@affinity-lab/affinity-util";
export type Role = string | Array<string>;
export type Roles = {
    read: Role;
    create: Role;
    update: Role;
    delete: Role;
};
export declare class SapphireCom {
    protected readonly formAdapter: IForm;
    protected readonly listAdapter: IList;
    protected readonly authResolver: AuthResolver<any>;
    protected readonly tmpFile: (...args: any) => TmpFile;
    protected roles: Role | Roles;
    constructor(formAdapter: IForm, listAdapter: IList, authResolver: AuthResolver<any>, tmpFile: (...args: any) => TmpFile, roles: Role | Roles);
    protected getRole(type: keyof Roles): Array<string>;
    list(args: {
        reqPageIndex: number;
        pageSize: number;
        search?: string;
        order?: string;
        filter?: Array<string>;
    }, req: Request): Promise<{
        items: {
            data: any;
            type: any;
        }[];
        page: number;
        count: number;
    }>;
    form(args: {
        id: string | null;
        values?: Record<string, any>;
    }, req: Request): Promise<Record<string, any>>;
    save(args: {
        id: number | null;
        values: Record<string, any>;
    }, req: Request): Promise<number | undefined>;
    delete(args: {
        id: number;
    }, req: Request): Promise<void>;
    file(args: {
        id: string;
        collectionName: string;
    }, req: Request, { files }: Files): Promise<"collection doesn't exist!" | "No files were given!" | "done">;
    collection(args: {
        id: string;
    }, req: Request): Promise<any[]>;
    changeFileData(args: {
        id: string;
        collectionName: string;
        fileName: string;
        newMetaData?: Record<string, any>;
        newName?: string;
    }, req: Request): Promise<"collection doesn't exist!" | "done">;
    deleteFile(args: {
        id: string;
        collectionName: string;
        fileName: string;
    }, req: Request): Promise<"collection doesn't exist!" | "done">;
    changeFileOrder(args: {
        id: string;
        collectionName: string;
        fileName: string;
        position: string;
    }, req: Request): Promise<"collection doesn't exist!" | "done">;
}

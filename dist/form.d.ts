import { MySqlTableWithColumns } from "drizzle-orm/mysql-core";
import { MySqlRepository } from "@affinity-lab/blitz";
import { ZodObject } from "zod";
import { TmpFile } from "@affinity-lab/util";
export declare abstract class IForm<I extends MySqlTableWithColumns<any> = any> {
    schema: I;
    protected repository: MySqlRepository;
    protected validator?: ZodObject<any, import("zod").UnknownKeysParam, import("zod").ZodTypeAny, {
        [x: string]: any;
    }, {
        [x: string]: any;
    }> | undefined;
    protected type: string;
    protected constructor(schema: I, repository: MySqlRepository, validator?: ZodObject<any, import("zod").UnknownKeysParam, import("zod").ZodTypeAny, {
        [x: string]: any;
    }, {
        [x: string]: any;
    }> | undefined);
    getItem(id: number | null, values?: Record<string, any>): Promise<Record<string, any> | undefined>;
    protected saveItem(id: number | null, values: Record<string, any>): Promise<number | undefined>;
    protected import(id: number | null, values: Record<string, any>): Promise<Record<string, any>>;
    protected export(item: any, values?: Record<string, any>): Promise<any>;
    protected abstract newItem(values?: Record<string, any>): Promise<{
        type: string;
        data: Partial<I> & Record<string, any>;
    }>;
    insert(values: Record<string, any>): Promise<number | undefined>;
    update(id: number, values: Record<string, any>): Promise<number>;
    form(id: number | null, values?: Record<string, any>): Promise<Record<string, any>>;
    save(id: number | null, values: Record<string, any>): Promise<number | undefined>;
    delete(id: number): Promise<void>;
    file(id: number, collectionName: string, files: Array<TmpFile>): Promise<"collection doesn't exist!" | "No files were given!" | "done">;
    collection(id: number): Promise<{
        name: string;
        items: import("@affinity-lab/blitz").Attachments;
        publicMetaFields: import("@affinity-lab/blitz").MetaField[];
        rules: import("@affinity-lab/blitz").Rules;
    }[]>;
    changeFileData(id: number, collectionName: string, fileName: string, newMetaData?: Record<string, any>, newName?: string): Promise<"collection doesn't exist!" | "done">;
    deleteFile(id: number, collectionName: string, fileName: string): Promise<"collection doesn't exist!" | "done">;
    changeFileOrder(id: number, collectionName: string, fileName: string, position: number): Promise<"collection doesn't exist!" | "done">;
}

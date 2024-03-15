import { MySqlColumn, MySqlSelectWithout, MySqlTableWithColumns } from "drizzle-orm/mysql-core";
import { MySqlRepository } from "@affinity-lab/blitz";
import { MySql2Database } from "drizzle-orm/mysql2";
import { SQL, SQLWrapper } from "drizzle-orm";
import { AnyMySqlSelectQueryBuilder } from "drizzle-orm/mysql-core/query-builders/select.types";
import { GetSelectTableSelection, SelectResultField } from "drizzle-orm/query-builders/select.types";
type MaybeArray<T> = T | Array<T>;
type Order = {
    by: MySqlColumn;
    reverse: boolean | undefined;
};
export type Orders = Record<string, Array<Order>>;
type SpecialSearch = {
    table: MySqlTableWithColumns<any>;
    field: string;
    connection: SQL;
};
export type Search = MaybeArray<MySqlColumn | SpecialSearch> | undefined;
export type Filter = SQLWrapper | SQL | undefined;
export type BaseSelect<A extends AnyMySqlSelectQueryBuilder = any, B extends boolean = any, C extends keyof A & string = any> = MySqlSelectWithout<A, B, C>;
export declare class IList<T extends MySqlTableWithColumns<any> = any, S extends Record<string, any> = any, R extends MySqlRepository = any, I extends MySqlTableWithColumns<any> = any> {
    protected schema: T;
    protected db: MySql2Database<S>;
    protected quickSearchFields: Search;
    constructor(schema: T, db: MySql2Database<S>, quickSearchFields: Search);
    protected export(item: {
        [K in keyof {
            [Key in keyof GetSelectTableSelection<T> & string]: SelectResultField<GetSelectTableSelection<T>[Key], true>;
        }]: {
            [Key in keyof GetSelectTableSelection<T> & string]: SelectResultField<GetSelectTableSelection<T>[Key], true>;
        }[K];
    }): { [K in keyof { [Key in keyof GetSelectTableSelection<T> & string]: SelectResultField<GetSelectTableSelection<T>[Key], true>; }]: { [Key_1 in keyof GetSelectTableSelection<T> & string]: SelectResultField<GetSelectTableSelection<T>[Key_1], true>; }[K]; };
    page(reqPageIndex: number, pageSize: number, search?: string, order?: string, filter?: Record<string, any>): Promise<{
        items: {
            data: { [K in keyof { [Key in keyof GetSelectTableSelection<T> & string]: SelectResultField<GetSelectTableSelection<T>[Key], true>; }]: { [Key_1 in keyof GetSelectTableSelection<T> & string]: SelectResultField<GetSelectTableSelection<T>[Key_1], true>; }[K]; };
            type: T["_"]["name"];
        }[];
        page: number;
        count: number;
    }>;
    private select;
    private join;
    private pagination;
    private where;
    protected defaultFilter(): Promise<Filter>;
    protected composeFilter(args: Record<string, any> | undefined): Promise<Filter>;
    protected quickSearchFilter(key?: string): Promise<Filter>;
    private calcPageIndex;
    private count;
    protected orderBy(base: BaseSelect, name: string | undefined): BaseSelect;
    protected get orders(): Orders;
}
export {};

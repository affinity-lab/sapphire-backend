import { MySqlColumn, MySqlSelectWithout, MySqlTableWithColumns } from "drizzle-orm/mysql-core";
import { MySqlRepository } from "@affinity-lab/blitz";
import { MySql2Database } from "drizzle-orm/mysql2";
import { SQL, SQLWrapper } from "drizzle-orm";
import { AnyMySqlSelectQueryBuilder } from "drizzle-orm/mysql-core/query-builders/select.types";
type Order = {
    by: MySqlColumn;
    reverse: boolean | undefined;
};
type Orders = Record<string, Array<Order>>;
type Search = MySqlColumn | Array<MySqlColumn> | undefined;
type Filter = SQLWrapper | SQL | undefined;
type BaseSelect<A extends AnyMySqlSelectQueryBuilder = any, B extends boolean = any, C extends keyof A & string = any> = MySqlSelectWithout<A, B, C>;
export declare class IList<T extends MySqlTableWithColumns<any> = any, S extends Record<string, any> = any, R extends MySqlRepository = any, I extends MySqlTableWithColumns<any> = any> {
    protected schema: T;
    protected db: MySql2Database<S>;
    protected quickSearchFields?: Search;
    constructor(schema: T, db: MySql2Database<S>, quickSearchFields?: Search);
    protected export(item: any): any;
    page(reqPageIndex: number, pageSize: number, search?: string, order?: string, filter?: Record<string, any>): Promise<{
        items: {
            data: any;
            type: T["_"]["name"];
        }[];
        page: number;
        count: number;
    }>;
    private pagination;
    private where;
    protected defaultFilter(): Filter;
    protected composeFilter(args: Record<string, any> | undefined): Filter;
    protected quickSearchFilter(key?: string): Filter;
    private calcPageIndex;
    private count;
    protected orderBy(base: BaseSelect, name: string | undefined): BaseSelect;
    protected get orders(): Orders;
}
export {};

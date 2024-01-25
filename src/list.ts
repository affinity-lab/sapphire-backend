import {MySqlColumn, MySqlSelectWithout, MySqlTableWithColumns} from "drizzle-orm/mysql-core";
import {MySqlRepository} from "@affinity-lab/blitz";
import {MySql2Database} from "drizzle-orm/mysql2";
import {and, asc, desc, getTableName, like, or, sql, SQL, SQLWrapper} from "drizzle-orm";
import {AnyMySqlSelectQueryBuilder} from "drizzle-orm/mysql-core/query-builders/select.types";

type Order = {by: MySqlColumn, reverse: boolean | undefined};
type Orders = Record<string, Array<Order>>;
type Search = MySqlColumn | Array<MySqlColumn> | undefined;
type Filter = Array<SQLWrapper> | SQLWrapper;
type BaseSelect<A extends AnyMySqlSelectQueryBuilder = any, B extends boolean = any, C extends keyof A & string = any> = MySqlSelectWithout<A, B, C>;

export class IList<T extends MySqlTableWithColumns<any> = any, S extends Record<string, any> = any, R extends MySqlRepository = any, I extends MySqlTableWithColumns<any> = any> {
	protected orders: Orders = {};

	constructor(
		protected schema: T,
		protected db: MySql2Database<S>,
		protected quickSearch?: Search,
		protected defaultFilters?: Filter,
	)
	{
		if (typeof this.defaultFilters === "undefined") this.defaultFilters = [];
		else if(!Array.isArray(this.defaultFilters)) this.defaultFilters = [this.defaultFilters];
		this.orderConst();
	}

	protected export(item: any) {return item}
	protected orderConst() {}

	public async page(reqPageIndex: number, pageSize: number, search?: string, order?: string, filter?: Record<string, any>) {
		let w = this.where(search, filter)
		let c = await this.count(w);
		let pageIndex = this.calcPageIndex(reqPageIndex, pageSize, c);
		let q = this.db.select()
			.from(this.schema)
			.where(w)
		if (order) q = this.orderBy(q, order);
		if (pageSize) q = this.pagination(q, pageIndex, pageSize);
		const res = await q.execute();
		let items = [];
		let type = getTableName(this.schema);
		for (let item of res) items.push({data: this.export(item), type}) ;
		return {items, page: pageIndex, count: c}
	}

	private pagination(base: BaseSelect, pageIndex: number, pageSize: number): BaseSelect {
		return base.limit(pageSize).offset(pageIndex * pageSize)
	}

	private where(search?: string, filter?: Record<string, any>): SQL | undefined {
		let f = this.composeFilters(filter);
		return f ? (this.quickSearch ? and(f, this.search(search)) : f.getSQL()) : (this.quickSearch ? this.search(search) : undefined);
	}

	protected composeFilters(args: Record<string, any> | undefined): SQLWrapper | SQL | undefined {
		return undefined;
	}

	private calcPageIndex(pageIndex: number, pageSize: number, count: number): number {
		if (pageIndex < 0) return 0;
		if (!pageSize) return 0;
		let max = Math.floor(count / pageSize);
		return pageIndex <= max ? pageIndex : max;
	}

	public async count(where: SQL | undefined): Promise<number> {
		let q = this.db
			.select({amount: sql<number>`count('*')`})
			.from(this.schema)
			.where(where).prepare()
		return (await q.execute())[0].amount
	}

	protected search(key?: string): SQL<unknown> {
		console.log(key, typeof key!.trim)
		if (typeof key === "undefined" || key.trim().length === 0) return or()!;
		let likes: Array<SQL> = [];
		for (let col of Array.isArray(this.quickSearch) ? this.quickSearch : [this.quickSearch]) likes.push(like(col as MySqlColumn, `%${key}%`));
		return or(...likes)!;
	}

	protected orderBy(base: BaseSelect, name: string): BaseSelect {
		if (!Object.keys(this.orders).includes(name)) return null;
		let orderSQLs: Array<SQL> = [];
		for (let o of this.orders[name]) orderSQLs.push(o.reverse ? desc(o.by) : asc(o.by));
		return base.orderBy(...orderSQLs);
	}

	addOrder(orders: Orders): void
	addOrder(name: string, by: MySqlColumn, reverse?: boolean): void
	addOrder(oORn: string | Orders, by?: MySqlColumn, reverse?: boolean): void {
		if (typeof oORn === "string" && by) this.orders[oORn] = [{by, reverse}];
		if (typeof oORn === "object") for (let order of Object.keys(oORn)) this.orders[order] = oORn[order];
	}

}


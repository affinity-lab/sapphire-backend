"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IList = void 0;
const mysql_core_1 = require("drizzle-orm/mysql-core");
const drizzle_orm_1 = require("drizzle-orm");
class IList {
    schema;
    db;
    quickSearchFields;
    constructor(schema, db, quickSearchFields) {
        this.schema = schema;
        this.db = db;
        this.quickSearchFields = quickSearchFields;
    }
    export(item) {
        return item;
    }
    async page(reqPageIndex, pageSize, search, order, filter) {
        let w = await this.where(search, filter);
        let select = this.select(w);
        select = await this.orderBy(select, order);
        let c = await this.count(w);
        let pageIndex = this.calcPageIndex(reqPageIndex, pageSize, c);
        if (pageSize)
            select = this.pagination(select, pageIndex, pageSize);
        const res = await select.execute();
        let items = [];
        let type = (0, drizzle_orm_1.getTableName)(this.schema);
        for (let item of res)
            items.push({ data: await this.export(item), type });
        return { items, page: pageIndex, count: c };
    }
    select(where, count = false) {
        let s = count ? this.db.select({ amount: (0, drizzle_orm_1.sql) `count('*')` }) : this.db.select();
        let from = s.from(this.schema);
        let joinedS;
        for (let j of this.join())
            joinedS = (joinedS || from).innerJoin(j.table, j.connection);
        return (joinedS || from).where(where);
    }
    join() {
        let r = [];
        if (this.quickSearchFields)
            (Array.isArray(this.quickSearchFields) ? this.quickSearchFields : [this.quickSearchFields])
                .filter(i => (!(i instanceof mysql_core_1.MySqlColumn)))
                .forEach(i => {
                if (!r.includes({
                    table: i.table,
                    connection: i.connection
                })) {
                    r.push({
                        table: i.table,
                        connection: i.connection
                    });
                }
            });
        return r;
    }
    pagination(base, pageIndex, pageSize) {
        return base.limit(pageSize).offset(pageIndex * pageSize);
    }
    async where(search, filter) {
        const f = [await this.defaultFilter(), await this.composeFilter(filter), await this.quickSearchFilter(search)].filter(filters => !!filters);
        return (0, drizzle_orm_1.and)(...f);
    }
    async defaultFilter() {
        return undefined;
    }
    async composeFilter(args) {
        return undefined;
    }
    async quickSearchFilter(key) {
        if (typeof key === "undefined" || key.trim().length === 0)
            return (0, drizzle_orm_1.or)();
        let likes = [];
        for (let col of Array.isArray(this.quickSearchFields) ? this.quickSearchFields : [this.quickSearchFields]) {
            if (col instanceof mysql_core_1.MySqlColumn)
                likes.push((0, drizzle_orm_1.like)(col, `%${key}%`));
            else
                likes.push((0, drizzle_orm_1.like)(col.table[col.field], `%${key}%`));
        }
        return (0, drizzle_orm_1.or)(...likes);
    }
    calcPageIndex(pageIndex, pageSize, count) {
        if (pageIndex < 0)
            return 0;
        if (!pageSize)
            return 0;
        let max = Math.floor(count / pageSize);
        return pageIndex <= max ? pageIndex : max;
    }
    async count(where) {
        let q = this.select(where, true).prepare();
        return (await q.execute())[0].amount;
    }
    async orderBy(base, name) {
        if (!name)
            name = Object.keys(this.orders)[0];
        if (Object.keys(this.orders).length === 0 || !Object.keys(this.orders).includes(name))
            return null;
        let orderSQLs = [];
        for (let o of this.orders[name])
            orderSQLs.push(o.reverse ? (0, drizzle_orm_1.desc)(o.by) : (0, drizzle_orm_1.asc)(o.by));
        return base.orderBy(...orderSQLs) || base;
    }
    get orders() {
        return {};
    }
}
exports.IList = IList;
//# sourceMappingURL=list.js.map
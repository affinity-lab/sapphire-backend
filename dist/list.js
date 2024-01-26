"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IList = void 0;
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
    export(item) { return item; }
    async page(reqPageIndex, pageSize, search, order, filter) {
        let w = this.where(search, filter);
        let c = await this.count(w);
        let pageIndex = this.calcPageIndex(reqPageIndex, pageSize, c);
        let q = this.db.select()
            .from(this.schema)
            .where(w);
        q = this.orderBy(q, order);
        if (pageSize)
            q = this.pagination(q, pageIndex, pageSize);
        const res = await q.execute();
        let items = [];
        let type = (0, drizzle_orm_1.getTableName)(this.schema);
        for (let item of res)
            items.push({ data: this.export(item), type });
        return { items, page: pageIndex, count: c };
    }
    pagination(base, pageIndex, pageSize) {
        return base.limit(pageSize).offset(pageIndex * pageSize);
    }
    where(search, filter) {
        const f = [this.defaultFilter(), this.composeFilter(filter), this.quickSearchFilter(search)].filter(filters => !!filters);
        return (0, drizzle_orm_1.and)(...f);
    }
    defaultFilter() {
        return undefined;
    }
    composeFilter(args) {
        return undefined;
    }
    quickSearchFilter(key) {
        if (typeof key === "undefined" || key.trim().length === 0)
            return (0, drizzle_orm_1.or)();
        let likes = [];
        for (let col of Array.isArray(this.quickSearchFields) ? this.quickSearchFields : [this.quickSearchFields])
            likes.push((0, drizzle_orm_1.like)(col, `%${key}%`));
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
        let q = this.db
            .select({ amount: (0, drizzle_orm_1.sql) `count('*')` })
            .from(this.schema)
            .where(where).prepare();
        return (await q.execute())[0].amount;
    }
    orderBy(base, name) {
        if (!name)
            name = Object.keys(this.orders)[0];
        if (Object.keys(this.orders).length === 0 || !Object.keys(this.orders).includes(name))
            return null;
        let orderSQLs = [];
        for (let o of this.orders[name])
            orderSQLs.push(o.reverse ? (0, drizzle_orm_1.desc)(o.by) : (0, drizzle_orm_1.asc)(o.by));
        return base.orderBy(...orderSQLs);
    }
    get orders() { return {}; }
}
exports.IList = IList;
//# sourceMappingURL=list.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IList = void 0;
const drizzle_orm_1 = require("drizzle-orm");
class IList {
    schema;
    db;
    quickSearch;
    defaultFilters;
    orders = {};
    constructor(schema, db, quickSearch, defaultFilters) {
        this.schema = schema;
        this.db = db;
        this.quickSearch = quickSearch;
        this.defaultFilters = defaultFilters;
        if (typeof this.defaultFilters === "undefined")
            this.defaultFilters = [];
        else if (!Array.isArray(this.defaultFilters))
            this.defaultFilters = [this.defaultFilters];
        this.orderConst();
    }
    export(item) { return item; }
    orderConst() { }
    async page(reqPageIndex, pageSize, search, order, filter) {
        let w = this.where(search, filter);
        let c = await this.count(w);
        let pageIndex = this.calcPageIndex(reqPageIndex, pageSize, c);
        let q = this.db.select()
            .from(this.schema)
            .where(w);
        if (order)
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
        let f = this.composeFilters(filter);
        return f ? (this.quickSearch ? (0, drizzle_orm_1.and)(f, this.search(search)) : f.getSQL()) : (this.quickSearch ? this.search(search) : undefined);
    }
    composeFilters(args) {
        return undefined;
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
    search(key) {
        console.log(key, typeof key.trim);
        if (typeof key === "undefined" || key.trim().length === 0)
            return (0, drizzle_orm_1.or)();
        let likes = [];
        for (let col of Array.isArray(this.quickSearch) ? this.quickSearch : [this.quickSearch])
            likes.push((0, drizzle_orm_1.like)(col, `%${key}%`));
        return (0, drizzle_orm_1.or)(...likes);
    }
    orderBy(base, name) {
        if (!Object.keys(this.orders).includes(name))
            return null;
        let orderSQLs = [];
        for (let o of this.orders[name])
            orderSQLs.push(o.reverse ? (0, drizzle_orm_1.desc)(o.by) : (0, drizzle_orm_1.asc)(o.by));
        return base.orderBy(...orderSQLs);
    }
    addOrder(oORn, by, reverse) {
        if (typeof oORn === "string" && by)
            this.orders[oORn] = [{ by, reverse }];
        if (typeof oORn === "object")
            for (let order of Object.keys(oORn))
                this.orders[order] = oORn[order];
    }
}
exports.IList = IList;
//# sourceMappingURL=list.js.map
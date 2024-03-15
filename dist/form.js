"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.IForm = void 0;
const drizzle_orm_1 = require("drizzle-orm");
const path_1 = __importDefault(require("path"));
const util_1 = require("@affinity-lab/util");
class IForm {
    schema;
    repository;
    validator;
    type;
    constructor(schema, repository, validator) {
        this.schema = schema;
        this.repository = repository;
        this.validator = validator;
        this.type = (0, drizzle_orm_1.getTableName)(this.schema);
    }
    async getItem(id, values) {
        return id ? await this.export(this.repository.get(id), values) : await this.newItem(values);
    }
    async saveItem(id, values) {
        values = await this.import(id, values);
        if (this.validator) {
            const parsed = this.validator.safeParse(values);
            if (!parsed.success)
                throw new util_1.ExtendedError("Validation extended-error", "VALIDATION_ERROR", parsed.error.issues, 400);
            values = parsed.data;
        }
        return id ? this.update(id, values) : this.insert(values);
    }
    async import(id, values) {
        for (let key of Object.keys(this.schema)) {
            let field = this.schema[key];
            if (field.dataType === 'date') {
                values[field.name] = new Date(values[field.name]);
            }
        }
        return values;
    }
    async export(item, values) { return item; }
    async insert(values) {
        return await this.repository.insert(values);
    }
    async update(id, values) {
        await this.repository.update(id, values);
        return id;
    }
    async form(id, values) {
        let item = await this.getItem(id, values);
        if (item === undefined)
            throw new util_1.ExtendedError("Bad ID", "");
        return item;
    }
    async save(id, values) { return this.saveItem(id, values); }
    async delete(id) { await this.repository.delete(id); }
    async file(id, collectionName, files) {
        let collection = undefined;
        for (let c of this.repository.files)
            if (c.name === collectionName)
                collection = c;
        if (!collection)
            return "collection doesn't exist!";
        if (files)
            for (let file of files)
                await collection.add(id, file);
        else
            return "No files were given!";
        return "done";
    }
    async collection(id) {
        let collections = [];
        for (let collection of this.repository.files) {
            let files = await collection.get(id);
            collections.push({
                name: collection.name,
                items: files,
                publicMetaFields: collection.publicMetaFields,
                rules: collection.rules
            });
        }
        return collections;
    }
    async changeFileData(id, collectionName, fileName, newMetaData, newName) {
        let collection = undefined;
        for (let c of this.repository.files)
            if (c.name === collectionName)
                collection = c;
        if (!collection)
            return "collection doesn't exist!";
        if (newMetaData)
            await collection.setMetadata(id, fileName, newMetaData);
        if (newName) {
            let ext = path_1.default.extname(fileName);
            newName = newName.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
            if ((fileName.split('.')[0] !== newName.split('.')[0]) || (path_1.default.extname(newName) !== ext && path_1.default.extname(newName) !== '')) {
                if (path_1.default.extname(newName) !== ext) {
                    console.log(fileName, ext, newName);
                    newName += ext;
                }
                await collection.rename(id, fileName, newName);
            }
        }
        return "done";
    }
    async deleteFile(id, collectionName, fileName) {
        let collection = undefined;
        for (let c of this.repository.files)
            if (c.name === collectionName)
                collection = c;
        if (!collection)
            return "collection doesn't exist!";
        await collection.delete(id, fileName);
        return "done";
    }
    async changeFileOrder(id, collectionName, fileName, position) {
        let collection = undefined;
        for (let c of this.repository.files)
            if (c.name === collectionName)
                collection = c;
        if (!collection)
            return "collection doesn't exist!";
        await collection.setPosition(id, fileName, position);
        return "done";
    }
}
exports.IForm = IForm;
//# sourceMappingURL=form.js.map
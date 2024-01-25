"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SapphireCom = void 0;
const x_com_1 = require("@affinity-lab/x-com");
const affinity_util_1 = require("@affinity-lab/affinity-util");
class SapphireCom {
    formAdapter;
    listAdapter;
    authResolver;
    tmpFile;
    roles;
    constructor(formAdapter, listAdapter, authResolver, tmpFile, roles) {
        this.formAdapter = formAdapter;
        this.listAdapter = listAdapter;
        this.authResolver = authResolver;
        this.tmpFile = tmpFile;
        this.roles = roles;
    }
    getRole(type) {
        if (typeof this.roles === "string")
            return [this.roles];
        if (Array.isArray(this.roles))
            return this.roles;
        let r = this.roles[type];
        if (typeof r === "string")
            return [r];
        return r;
    }
    async list(args, req) {
        if (!(await this.authResolver.hasRole(req, this.getRole("read"))))
            throw new affinity_util_1.ExtendedError("UNAUTHORIZED to read list", "FORBIDDEN");
        return this.listAdapter.page(args.reqPageIndex, args.pageSize, args.search, args.order, args.filter);
    }
    async form(args, req) {
        if (!(await this.authResolver.hasRole(req, this.getRole("read"))))
            throw new affinity_util_1.ExtendedError("UNAUTHORIZED to read from", "FORBIDDEN");
        let id = args.id ? parseInt(args.id) : null;
        return this.formAdapter.form(id);
    }
    async save(args, req) {
        if (typeof args.id === null)
            if (!(await this.authResolver.hasRole(req, this.getRole("create"))))
                throw new affinity_util_1.ExtendedError("UNAUTHORIZED to create from", "FORBIDDEN");
        if (!(await this.authResolver.hasRole(req, this.getRole("update"))))
            throw new affinity_util_1.ExtendedError("UNAUTHORIZED to update from", "FORBIDDEN");
        return this.formAdapter.save(args.id, args.values);
    }
    async delete(args, req) {
        if (!(await this.authResolver.hasRole(req, this.getRole("delete"))))
            throw new affinity_util_1.ExtendedError("UNAUTHORIZED to delete from", "FORBIDDEN");
        return this.formAdapter.delete(args.id);
    }
    async file(args, req, { files }) {
        if (!(await this.authResolver.hasRole(req, this.getRole("update"))))
            throw new affinity_util_1.ExtendedError("UNAUTHORIZED to upload file", "FORBIDDEN");
        return this.formAdapter.file(parseInt(args.id), args.collectionName, files.map(f => this.tmpFile(f)));
    }
    async collection(args, req) {
        if (!(await this.authResolver.hasRole(req, this.getRole("read"))))
            throw new affinity_util_1.ExtendedError("UNAUTHORIZED to read collection info", "FORBIDDEN");
        return this.formAdapter.collection(parseInt(args.id));
    }
    async changeFileData(args, req) {
        if (!(await this.authResolver.hasRole(req, this.getRole("update"))))
            throw new affinity_util_1.ExtendedError("UNAUTHORIZED to change file data", "FORBIDDEN");
        return this.formAdapter.changeFileData(parseInt(args.id), args.collectionName, args.fileName, args.newMetaData, args.newName);
    }
    async deleteFile(args, req) {
        if (!(await this.authResolver.hasRole(req, this.getRole("delete"))))
            throw new affinity_util_1.ExtendedError("UNAUTHORIZED to delete file", "FORBIDDEN");
        return this.formAdapter.deleteFile(parseInt(args.id), args.collectionName, args.fileName);
    }
    async changeFileOrder(args, req) {
        if (!(await this.authResolver.hasRole(req, this.getRole("update"))))
            throw new affinity_util_1.ExtendedError("UNAUTHORIZED to change file order", "FORBIDDEN");
        return this.formAdapter.changeFileOrder(parseInt(args.id), args.collectionName, args.fileName, parseInt(args.position));
    }
}
exports.SapphireCom = SapphireCom;
__decorate([
    (0, x_com_1.Command)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], SapphireCom.prototype, "list", null);
__decorate([
    (0, x_com_1.Command)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], SapphireCom.prototype, "form", null);
__decorate([
    (0, x_com_1.Command)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], SapphireCom.prototype, "save", null);
__decorate([
    (0, x_com_1.Command)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], SapphireCom.prototype, "delete", null);
__decorate([
    (0, x_com_1.Command)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object]),
    __metadata("design:returntype", Promise)
], SapphireCom.prototype, "file", null);
__decorate([
    (0, x_com_1.Command)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], SapphireCom.prototype, "collection", null);
__decorate([
    (0, x_com_1.Command)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], SapphireCom.prototype, "changeFileData", null);
__decorate([
    (0, x_com_1.Command)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], SapphireCom.prototype, "deleteFile", null);
__decorate([
    (0, x_com_1.Command)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], SapphireCom.prototype, "changeFileOrder", null);
//# sourceMappingURL=sapphire-com.js.map
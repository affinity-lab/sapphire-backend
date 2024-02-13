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
exports.AbstractTagXCom = void 0;
const x_com_1 = require("@affinity-lab/x-com");
const affinity_util_1 = require("@affinity-lab/affinity-util");
class AbstractTagXCom {
    repository;
    async create(args) {
        await this.repository.createTag(args.name);
        return true;
    }
    async modify(args) {
        if (args.name === undefined || args.newName === undefined)
            throw new affinity_util_1.ExtendedError("Gimmi names man", "");
        if (args.name.trim() !== args.newName.trim())
            await this.repository.renameTag(args.name, args.newName);
        if (args.predefined !== undefined)
            await this.repository.changePredefinedTag(args.newName, args.predefined);
        return true;
    }
    async delete(args) {
        await this.repository.deleteTag(args.name);
        return true;
    }
    async get() {
        return this.repository.getTags();
    }
}
exports.AbstractTagXCom = AbstractTagXCom;
__decorate([
    (0, x_com_1.Command)("create"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AbstractTagXCom.prototype, "create", null);
__decorate([
    (0, x_com_1.Command)("modify"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AbstractTagXCom.prototype, "modify", null);
__decorate([
    (0, x_com_1.Command)("delete"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AbstractTagXCom.prototype, "delete", null);
__decorate([
    (0, x_com_1.Command)("get"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AbstractTagXCom.prototype, "get", null);
//# sourceMappingURL=abstract-tag-x-com.js.map
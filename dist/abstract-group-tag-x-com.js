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
exports.AbstractGroupTagXCom = void 0;
const tag_x_com_interface_1 = require("./tag-x-com-interface");
const x_com_1 = require("@affinity-lab/x-com");
const util_1 = require("@affinity-lab/util");
class AbstractGroupTagXCom extends tag_x_com_interface_1.ITagXCom {
    groupIdFunc;
    async create(args, req) {
        let id = await this.groupIdFunc(req);
        await this.repository.createTag(args.name, id);
        return true;
    }
    async modify(args, req) {
        if (args.name === undefined || args.newName === undefined)
            throw new util_1.ExtendedError("Gimmi names man", "", undefined, 400);
        let id = await this.groupIdFunc(req);
        if (args.name.trim() !== args.newName.trim())
            await this.repository.renameTag(args.name, args.newName, id);
        if (args.predefined !== undefined)
            await this.repository.changePredefinedTag(args.newName, args.predefined, id);
        return true;
    }
    async delete(args, req) {
        let id = await this.groupIdFunc(req);
        await this.repository.deleteTag(args.name, id);
        return true;
    }
    async get(args, req) {
        let id = await this.groupIdFunc(req);
        return this.repository.getTags(id);
    }
}
exports.AbstractGroupTagXCom = AbstractGroupTagXCom;
__decorate([
    (0, x_com_1.Command)("create"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AbstractGroupTagXCom.prototype, "create", null);
__decorate([
    (0, x_com_1.Command)("modify"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AbstractGroupTagXCom.prototype, "modify", null);
__decorate([
    (0, x_com_1.Command)("delete"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AbstractGroupTagXCom.prototype, "delete", null);
__decorate([
    (0, x_com_1.Command)("get"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AbstractGroupTagXCom.prototype, "get", null);
// groupId?: (req: Request) => MaybePromise<number>
//# sourceMappingURL=abstract-group-tag-x-com.js.map
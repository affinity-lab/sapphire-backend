"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ITagXCom = void 0;
class ITagXCom {
    authResolver;
    roles;
    repository;
    constructor(authResolver, roles) {
        this.authResolver = authResolver;
        this.roles = roles;
        this.initialize();
    }
    initialize() { }
    async hasRole(req) {
        if (!this.authResolver || !this.roles)
            return true;
        let r;
        if (typeof this.roles === "string")
            r = [this.roles];
        else
            r = this.roles;
        return this.authResolver.hasRole(req, r);
    }
}
exports.ITagXCom = ITagXCom;
//# sourceMappingURL=tag-x-com-interface.js.map
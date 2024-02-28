import {IForm} from "./form";
import {IList} from "./list";
import {AuthResolver} from "./interfaces";
import {Command, Files} from "@affinity-lab/x-com";
import {Request} from "express";
import {ExtendedError, TmpFile} from "@affinity-lab/affinity-util";

export type Role = string | Array<string>
export type Roles = {read: Role, create: Role, update: Role, delete: Role}

export class SapphireCom {
	constructor(
		protected readonly formAdapter: IForm,
		protected readonly listAdapter: IList,
		protected readonly authResolver: AuthResolver<any>,
		protected readonly tmpFile: (...args: any) => TmpFile,
		protected roles: Role | Roles
	) {
	}

	protected getRole(type: keyof Roles): Array<string> {
		if (typeof this.roles === "string") return [this.roles];
		if (Array.isArray(this.roles)) return this.roles;
		let r = this.roles[type];
		if (typeof r === "string") return [r];
		return r;
	}

	@Command()
	async list(args: {reqPageIndex: number, pageSize: number, search?: string, order?: string, filter?: Record<string, any>}, req: Request) {
		if(!(await this.authResolver.hasRole(req, this.getRole("read")))) throw new ExtendedError("UNAUTHORIZED to read list", "FORBIDDEN", undefined, 403);
		return this.listAdapter.page(args.reqPageIndex, args.pageSize, args.search, args.order, args.filter);
	}

	@Command()
	async form(args: {id: string | null, values?: Record<string, any>}, req: Request) {
		if(!(await this.authResolver.hasRole(req, this.getRole("read")))) throw new ExtendedError("UNAUTHORIZED to read from", "FORBIDDEN", undefined, 403);
		let id = args.id ? parseInt(args.id): null
		return this.formAdapter.form(id, args.values);
	}

	@Command()
	async save(args: {id: number | null, values: Record<string, any>}, req: Request) {
		if(typeof args.id === null) if(!(await this.authResolver.hasRole(req, this.getRole("create")))) throw new ExtendedError("UNAUTHORIZED to create from", "FORBIDDEN", undefined, 403);
		if(!(await this.authResolver.hasRole(req, this.getRole("update")))) throw new ExtendedError("UNAUTHORIZED to update from", "FORBIDDEN", undefined, 403);
		return this.formAdapter.save(args.id, args.values);
	}

	@Command()
	async delete(args: {id: number}, req: Request): Promise<void> {
		if(!(await this.authResolver.hasRole(req, this.getRole("delete")))) throw new ExtendedError("UNAUTHORIZED to delete from", "FORBIDDEN", undefined, 403);
		return this.formAdapter.delete(args.id);
	}

	@Command()
	async file(args: {id: string, collectionName: string}, req: Request, {files}: Files) {
		if(!(await this.authResolver.hasRole(req, this.getRole("update")))) throw new ExtendedError("UNAUTHORIZED to upload file", "FORBIDDEN", undefined, 403);
		return this.formAdapter.file(parseInt(args.id), args.collectionName, files.map(f=>this.tmpFile(f)))
	}

	@Command()
	async collection(args: {id: string}, req: Request): Promise<any[]> {
		if(!(await this.authResolver.hasRole(req, this.getRole("read")))) throw new ExtendedError("UNAUTHORIZED to read collection info", "FORBIDDEN", undefined, 403);
		return this.formAdapter.collection(parseInt(args.id));
	}

	@Command()
	async changeFileData(args: {id: string, collectionName: string, fileName: string, newMetaData?: Record<string, any>, newName?: string}, req: Request) {
		if(!(await this.authResolver.hasRole(req, this.getRole("update")))) throw new ExtendedError("UNAUTHORIZED to change file data", "FORBIDDEN", undefined, 403);
		return this.formAdapter.changeFileData(parseInt(args.id), args.collectionName, args.fileName, args.newMetaData, args.newName);
	}

	@Command()
	async deleteFile(args: {id: string, collectionName: string, fileName: string}, req: Request) {
		if(!(await this.authResolver.hasRole(req, this.getRole("delete")))) throw new ExtendedError("UNAUTHORIZED to delete file", "FORBIDDEN", undefined, 403);
		return this.formAdapter.deleteFile(parseInt(args.id), args.collectionName, args.fileName);
	}

	@Command()
	async changeFileOrder(args: {id: string, collectionName: string, fileName: string, position: string}, req: Request) {
		if(!(await this.authResolver.hasRole(req, this.getRole("update")))) throw new ExtendedError("UNAUTHORIZED to change file order", "FORBIDDEN", undefined, 403);
		return this.formAdapter.changeFileOrder(parseInt(args.id), args.collectionName, args.fileName, parseInt(args.position));
	}
}
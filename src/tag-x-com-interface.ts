import {ITagRepository} from "@affinity-lab/blitz";
import {MaybeArray} from "@affinity-lab/util";
import {Request} from "express";
import {AuthResolver} from "./interfaces";

export abstract class ITagXCom {
	protected repository: ITagRepository;
	protected constructor(
		protected authResolver?: AuthResolver<any>,
		protected roles?: MaybeArray<string>
	) {
		this.initialize();
	}

	protected initialize() {}

	protected async hasRole(req: Request): Promise<boolean> {
		if(!this.authResolver || !this.roles) return true;
		let r: Array<string>;
		if (typeof this.roles === "string") r = [this.roles];
		else r = this.roles;
		return this.authResolver.hasRole(req, r);
	}

	abstract create(args: any, req: Request, ...more: any): Promise<boolean>;
	abstract modify(args: any, req: Request, ...more: any): Promise<boolean>;
	abstract delete(args: any, req: Request, ...more: any): Promise<boolean>;
	abstract get(args: any, req: Request, ...more: any): Promise<Array<any>>;

}
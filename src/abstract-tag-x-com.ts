import {Command} from "@affinity-lab/x-com";
import {ExtendedError} from "@affinity-lab/util";
import {Request} from "express";
import {ITagXCom} from "./tag-x-com-interface";


export class AbstractTagXCom extends ITagXCom{
	@Command("create")
	async create(args: { name: string }, req: Request): Promise<boolean> {
		if(!(await this.hasRole(req))) throw new ExtendedError("UNAUTHORIZED", "", undefined, 403);
		await this.repository.createTag(args.name);
		return true;
	}

	@Command("modify")
	async modify(args: { name: string, newName: string, predefined?: boolean }, req: Request): Promise<boolean> {
		if(!(await this.hasRole(req))) throw new ExtendedError("UNAUTHORIZED", "", undefined, 403);
		if (args.name === undefined || args.newName === undefined) throw new ExtendedError("Gimmi names man", "", undefined, 400);
		if (args.name.trim() !== args.newName.trim()) await this.repository.renameTag(args.name, args.newName);
		if (args.predefined !== undefined) await this.repository.changePredefinedTag(args.newName, args.predefined);
		return true;
	}

	@Command("delete")
	async delete(args: { name: string }, req: Request): Promise<boolean> {
		if(!(await this.hasRole(req))) throw new ExtendedError("UNAUTHORIZED", "", undefined, 403);
		await this.repository.deleteTag(args.name);
		return true;
	}

	@Command("get")
	async get(args: {}, req: Request): Promise<Array<{name: string, predefined: boolean}>> {
		if(!(await this.hasRole(req))) throw new ExtendedError("UNAUTHORIZED", "", undefined, 403);
		return this.repository.getTags();
	}
}
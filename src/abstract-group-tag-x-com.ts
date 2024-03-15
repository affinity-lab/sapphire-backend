import {ITagXCom} from "./tag-x-com-interface";
import {Command} from "@affinity-lab/x-com";
import {Request} from "express";
import {ExtendedError, MaybePromise} from "@affinity-lab/util";

export class AbstractGroupTagXCom extends ITagXCom {
	protected groupIdFunc: (req: Request) => MaybePromise<number>;
	@Command("create")
	async create(args: { name: string }, req: Request): Promise<boolean> {
		let id = await this.groupIdFunc(req)
		await this.repository.createTag(args.name, id);
		return true;
	}

	@Command("modify")
	async modify(args: { name: string, newName: string, predefined?: boolean }, req: Request): Promise<boolean> {
		if (args.name === undefined || args.newName === undefined) throw new ExtendedError("Gimmi names man", "", undefined, 400);
		let id = await this.groupIdFunc(req)
		if (args.name.trim() !== args.newName.trim()) await this.repository.renameTag(args.name, args.newName, id);
		if (args.predefined !== undefined) await this.repository.changePredefinedTag(args.newName, args.predefined, id);
		return true;
	}

	@Command("delete")
	async delete(args: { name: string }, req: Request): Promise<boolean> {
		let id = await this.groupIdFunc(req)
		await this.repository.deleteTag(args.name, id);
		return true;
	}

	@Command("get")
	async get(args: {}, req: Request): Promise<Array<any>> {
		let id = await this.groupIdFunc(req)
		return this.repository.getTags(id);
	}
}

// groupId?: (req: Request) => MaybePromise<number>
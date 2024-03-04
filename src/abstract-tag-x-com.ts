import {Command} from "@affinity-lab/x-com";
import {AbstractTagRepository} from "@affinity-lab/blitz";
import {ExtendedError} from "@affinity-lab/util";


export class AbstractTagXCom {
	protected repository: AbstractTagRepository

	@Command("create")
	async create(args: { name: string }): Promise<boolean> {
		await this.repository.createTag(args.name);
		return true;
	}

	@Command("modify")
	async modify(args: { name: string, newName: string, predefined?: boolean }): Promise<boolean> {
		if (args.name === undefined || args.newName === undefined) throw new ExtendedError("Gimmi names man", "", undefined, 400);
		if (args.name.trim() !== args.newName.trim()) await this.repository.renameTag(args.name, args.newName);
		if (args.predefined !== undefined) await this.repository.changePredefinedTag(args.newName, args.predefined);
		return true;
	}

	@Command("delete")
	async delete(args: { name: string }): Promise<boolean> {
		await this.repository.deleteTag(args.name);
		return true;
	}

	@Command("get")
	async get(): Promise<Array<{name: string, predefined: boolean}>> {
		return this.repository.getTags();
	}
}
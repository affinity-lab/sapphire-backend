import {MySqlTableWithColumns} from "drizzle-orm/mysql-core";
import {Collection, MySqlRepository} from "@affinity-lab/blitz";
import {Column, getTableName} from "drizzle-orm";
import Path from "path";
import {ZodObject} from "zod";
import {ExtendedError, TmpFile} from "@affinity-lab/util";

export abstract class IForm<I extends MySqlTableWithColumns<any> = any>{
	protected type: string;

	protected constructor(public schema: I,
						  protected repository: MySqlRepository,
						  protected validator?: ZodObject<any>
	) {
		this.type = getTableName(this.schema);
	}

	public async getItem(id: number | null, values?: Record<string, any>): Promise<Record<string, any> | undefined> {
		return id ? await this.export(this.repository.get(id), values) : await this.newItem(values) ;
	}

	protected async saveItem(id: number | null, values: Record<string, any>) {
		values = await this.import(id, values);
		if (this.validator) {
			const parsed = this.validator.safeParse(values)
			if (!parsed.success) throw new ExtendedError("Validation extended-error", "VALIDATION_ERROR", parsed.error.issues, 400);
			values = parsed.data
		}
		return id ? this.update(id, values) : this.insert(values);
	}
	protected async import(id : number | null, values: Record<string, any>) {
		for (let key of Object.keys(this.schema)) {
			let field = this.schema[key] as Column
			if (field.dataType === 'date') {
				values[field.name] = new Date(values[field.name])
			}
		}
		return values;
	}
	protected async export(item: any, values?: Record<string, any>) {return item;}
	protected abstract newItem(values?: Record<string, any>): Promise<{type: string, data: Partial<I> & Record<string, any>}>;
	public async insert(values: Record<string, any>): Promise<number | undefined> {
		return await this.repository.insert(values);
	}
	public async update(id: number, values: Record<string, any>): Promise<number> {
		await this.repository.update(id, values)
		return id;
	}

	async form(id: number | null, values?: Record<string, any>) {
		let item = await this.getItem(id, values);
		if (item === undefined) throw new ExtendedError("Bad ID", "");
		return item;
	}

	async save(id: number | null, values: Record<string, any>) {return this.saveItem(id, values);}

	async delete(id: number) {await this.repository.delete(id);}

	async file(id: number, collectionName: string, files: Array<TmpFile>) {
		let collection: Collection<any> | undefined = undefined;
		for (let c of this.repository.files) if (c.name === collectionName) collection = c;
		if (!collection) return "collection doesn't exist!";
		if (files) for (let file of files) await collection.add(id, file);
		else return "No files were given!";
		return "done";
	}

	async collection(id: number) {
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

	async changeFileData(id: number, collectionName: string, fileName: string, newMetaData?: Record<string, any>, newName?: string) {
		let collection: Collection<any> | undefined = undefined;
		for (let c of this.repository.files) if (c.name === collectionName) collection = c;
		if (!collection) return "collection doesn't exist!";
		if (newMetaData) await collection.setMetadata(id, fileName, newMetaData);
		if (newName) {
			let ext = Path.extname(fileName);
			newName = newName.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
			if ((fileName.split('.')[0] !== newName.split('.')[0]) || (Path.extname(newName) !== ext && Path.extname(newName) !== '')) {
				if (Path.extname(newName) !== ext) {
					console.log(fileName, ext, newName)
					newName += ext;
				}
				await collection.rename(id, fileName, newName);
			}
		}
		return "done";
	}

	async deleteFile(id: number, collectionName: string, fileName: string) {
		let collection: Collection<any> | undefined = undefined;
		for (let c of this.repository.files) if (c.name === collectionName) collection = c;
		if (!collection) return "collection doesn't exist!";
		await collection.delete(id, fileName);
		return "done";
	}

	async changeFileOrder(id: number, collectionName: string, fileName: string,  position: number) {
		let collection: Collection<any> | undefined = undefined;
		for (let c of this.repository.files) if (c.name === collectionName) collection = c;
		if (!collection) return "collection doesn't exist!";
		await collection.setPosition(id, fileName, position);
		return "done";
	}


}

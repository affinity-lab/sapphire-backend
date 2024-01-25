import {Request} from "express";

export interface ContextResolver {
	resolver(req: Request): Promise<any>;
}

export interface AuthResolver<U> {
	hasRole(req: Request, roles: string | Array<string>) : Promise<boolean>;
	userId(req: Request): Promise<number>;
	user(req: Request): Promise<U |undefined>;
}
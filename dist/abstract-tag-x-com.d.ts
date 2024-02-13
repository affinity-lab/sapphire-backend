import { AbstractTagRepository } from "@affinity-lab/blitz";
export declare class AbstractTagXCom {
    protected repository: AbstractTagRepository;
    create(args: {
        name: string;
    }): Promise<boolean>;
    modify(args: {
        name: string;
        newName: string;
        predefined?: boolean;
    }): Promise<boolean>;
    delete(args: {
        name: string;
    }): Promise<boolean>;
    get(): Promise<Array<{
        name: string;
        predefined: boolean;
    }>>;
}

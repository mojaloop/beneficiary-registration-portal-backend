import {IStorageRepo} from "../../src/types/types";
import {TokenData} from "../../src/models/TokenData";

export class StorageRepoMock implements IStorageRepo {
    SaveDateToDB(tokenData: TokenData): Promise<TokenData | { error: string }> {
        return Promise.resolve(tokenData);
    }

    init(): Promise<void> {
        return Promise.resolve(undefined);
    }

    destroy(): Promise<void> {
        return Promise.resolve(undefined);
    }

}
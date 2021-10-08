import { SignalModel } from "./signal.model";

export class StorageSignalModel {
    constructor(
        public address: string,
        public signals: SignalModel[],
    ) {}
}
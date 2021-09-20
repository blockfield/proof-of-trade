import { ProofDataModel } from "./proof-data.model";

export class ProofModel {
    constructor(
        public usdBalance: number|null = null,
        public ethBalance: number|null = null,
        public proof: ProofDataModel[] = [],
    ) {}
}
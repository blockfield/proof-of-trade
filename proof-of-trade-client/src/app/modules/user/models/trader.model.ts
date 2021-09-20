import { ProofModel } from "./proof.model";

export class TraderModel {
    constructor(
        public id: number,
        public email: string,
        public address: string,
        public proof: ProofModel[],
    ) {}
}
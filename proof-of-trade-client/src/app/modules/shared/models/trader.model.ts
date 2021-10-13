import { ProofItem } from "../../verifier/models/proof-item";

export class TraderModel {
    constructor(
        public id: number,
        public email: string,
        public address: string,
        public proof: ProofItem[],
        public date: Date
    ) {}
}
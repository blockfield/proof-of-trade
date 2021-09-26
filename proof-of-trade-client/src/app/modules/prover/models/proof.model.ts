import { ProofItem } from "./proof-item";
import { ProofModel as ZkProofModel } from "src/app/modules/shared/models/proof.model";

export class ProofModel {
    constructor(
        public usdBalance: number|null = null,
        public ethBalance: number|null = null,
        public proofs: ProofItem[] = [],
    ) {}

    public toZkProofModel(): ZkProofModel {
        return {
            usdBalance: this.usdBalance,
            ethBalance: this.ethBalance,
            proofs: this.proofs.map((x: ProofItem) => {return {
                id: x.id,
                currency: x.currency,
                action: x.action,
                amount: x.amount,
                nonce: x.nonce,
            }})
        }
    }
}
import { ProofModel as ZkProofModel } from "src/app/modules/shared/models/proof.model";
import { CurrencyEnum } from "src/app/core/enums/currency.enum";
import { SignalActionEnum } from "src/app/core/enums/signal-action.enum";

export class ProofModel {
    constructor(
        public usdBalance: number|null = null,
        public btcBalance: number|null = null,
        public proofs: ProofItem[] = [],
    ) {}

    public toZkProofModel(): ZkProofModel {
        return {
            usdBalance: this.usdBalance,
            btcBalance: this.btcBalance,
            proofs: this.proofs.map((x: ProofItem) => { return {
                id: x.id,
                currency: x.currency,
                action: x.action,
                amount: x.amount,
                nonce: x.nonce,
                price: x.price,
            } })
        }
    }
}

export class ProofItem {
    constructor(
        public id: number,
        public currency: CurrencyEnum,
        public action: SignalActionEnum,
        public amount: number|null = null,
        public nonce: number|null = null,
        public price: number|null = null,
    ) {}
}
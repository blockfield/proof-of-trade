import { CurrencyEnum } from "src/app/core/enums/currency.enum";
import { SignalActionEnum } from "src/app/core/enums/signal-action.enum";

export class ProofItem {
    constructor(
        public id: number,
        public currency: CurrencyEnum,
        public action: SignalActionEnum,
        public amount: number|null = null,
        public nonce: number|null = null
    ) {}
}
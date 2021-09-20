import { CurrencyEnum } from "../enums/currency.enum";
import { SignalActionEnum } from "../enums/signal-actione.enum";

export class ProofDataModel {
    constructor(
        public id: number,
        public currency: CurrencyEnum,
        public action: SignalActionEnum,
        public amount: number|null = null,
        public nonce: number|null = null
    ) {}
}
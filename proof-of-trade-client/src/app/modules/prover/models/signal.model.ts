import { CurrencyEnum } from "src/app/core/enums/currency.enum"
import { SignalActionEnum } from "src/app/core/enums/signal-action.enum"

export class SignalModel {
    public price: number

    constructor(
        public currency: CurrencyEnum|null = null,
        public amount: number = 0,
        public nonce: number|null = null,
        public action: SignalActionEnum|null = null,
    ) {}

    public clear(): void {
        this.currency = null
        this.amount = 0
        this.nonce = null
        this.action = null
    }
}
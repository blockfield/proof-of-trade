import { CurrencyEnum } from "src/app/core/enums/currency.enum"
import { SignalActionEnum } from "src/app/core/enums/signal-action.enum"

export class SignalModel {
    public price: number

    constructor(
        public id: number = 0,
        public currency: CurrencyEnum|null = null,
        public amount: number|null = null,
        public nonce: number|null = null,
        public action: SignalActionEnum|null = null,
        public isProved: boolean = false,
    ) {}

    public clear(): void {
        this.currency = null
        this.amount = null
        this.nonce = null
        this.action = null
        this.isProved = false
    }
}
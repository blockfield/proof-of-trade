import { CurrencyEnum } from "src/app/core/enums/currency.enum"
import { SignalActionEnum } from "src/app/core/enums/signal-action.enum"

export class SignalModel {
    private action: SignalActionEnum

    constructor(
        public currency: CurrencyEnum,
        public amount: number = 0,
        public nonce: number|null = null,
    ) {}

    public setAction(action: SignalActionEnum): void {
        this.action = action
    }

    public getAction(): SignalActionEnum {
        return this.action
    }
}
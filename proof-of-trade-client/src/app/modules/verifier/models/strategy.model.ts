import { VerificationTraderEnum } from "src/app/core/enums/verification-trader.enum";

export class StrategyModel {
    constructor(
        public id: number,
        public email: string,
        public address: string,
        public proofIds: number[],
        public avgProfitPerMonth: number,
        public avgProofCountPerMonth: number,
        public state: VerificationTraderEnum,
        public date: Date
    ) {}

    public setState(state: VerificationTraderEnum): void {
        this.state = state
    }
}
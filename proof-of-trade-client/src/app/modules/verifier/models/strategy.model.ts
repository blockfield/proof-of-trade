import { VerificationProverEnum } from "src/app/core/enums/verification-trader.enum";

export class StrategyModel {
    constructor(
        public id: number,
        public email: string,
        public address: string,
        public proofIds: number[],
        public avgProfitPerMonth: number,
        public avgProofCountPerMonth: number,
        public state: VerificationProverEnum,
        public date: Date
    ) {}

    public setState(state: VerificationProverEnum): void {
        this.state = state
    }
}
import { VerificationTraderEnum } from "src/app/core/enums/verification-trader.enum";
import { ProofItem } from "./proof-item";

export class TraderModel {
    constructor(
        public id: number,
        public email: string,
        public address: string,
        public proof: ProofItem[],
        public avgProfitPerMonth: number,
        public avgProofCountPerMonth: number,
        public state: VerificationTraderEnum,
        public date: Date
    ) {}

    public setState(state: VerificationTraderEnum): void {
        this.state = state
    }
}
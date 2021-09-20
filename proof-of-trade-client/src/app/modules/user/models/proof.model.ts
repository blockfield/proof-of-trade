import { VerificationStateEnum } from "../enums/verification-state.enum";

export class ProofModel {
    public state: VerificationStateEnum
    public percentage: number

    constructor(
        public id: number,
        private balance: number,
        private prevBalance: number,
    ) {
        this.state = VerificationStateEnum.Unverified

        if (prevBalance === 0) {
            prevBalance = balance
        }

        this.percentage = (balance / prevBalance - 1) * 100;
    }

    public verify(): void {
        if (this.id === 0) {
            this.state = VerificationStateEnum.Success
            return
        }

        this.state = VerificationStateEnum.Failed
    }
}
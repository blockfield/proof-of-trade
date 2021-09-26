import { VerificationEnum } from "src/app/core/enums/verification.enum";

export class ProofItem {
    public state: VerificationEnum
    public percentage: number

    constructor(
        public id: number,
        balance: number,
        prevBalance: number,
    ) {
        this.state = VerificationEnum.Unverified

        if (prevBalance === 0) {
            prevBalance = balance
        }

        this.percentage = (balance / prevBalance - 1) * 100;
    }

    public setState(isSucces: boolean): void {
        if (isSucces) {
            this.state = VerificationEnum.Success
            return
        }

        this.state = VerificationEnum.Failed
    }
}
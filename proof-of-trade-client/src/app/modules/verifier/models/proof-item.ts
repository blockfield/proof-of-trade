import { VerificationProofEnum } from "src/app/core/enums/verification-proof.enum";

export class ProofItem {
    public state: VerificationProofEnum
    public percentage: number

    constructor(
        public id: number,
        balance: number,
        prevBalance: number,
    ) {
        this.state = VerificationProofEnum.Unverified

        if (prevBalance === 0) {
            prevBalance = balance
        }

        this.percentage = (balance / prevBalance - 1) * 100;
    }

    public setState(isSucces: boolean): void {
        if (isSucces) {
            this.state = VerificationProofEnum.Success
            return
        }

        this.state = VerificationProofEnum.Failed
    }
}
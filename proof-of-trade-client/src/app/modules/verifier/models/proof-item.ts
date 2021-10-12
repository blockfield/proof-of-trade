import { VerificationProofEnum } from "src/app/core/enums/verification-proof.enum";

export class ProofItem {
    public state: VerificationProofEnum
    public percentage: number

    constructor(
        public id: number,
        public yieldNumber: number,
        public prevYieldNumber: number,
        public dateFrom: Date,
        public dateTo: Date,
    ) {
        this.state = VerificationProofEnum.Unverified

        if (prevYieldNumber === 0) {
            prevYieldNumber = yieldNumber
        }

        this.percentage = (yieldNumber / prevYieldNumber - 1) * 100;
    }

    public setState(isSucces: boolean): void {
        if (isSucces) {
            this.state = VerificationProofEnum.Success
            return
        }

        this.state = VerificationProofEnum.Failed
    }
}
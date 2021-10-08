import { VerificationProofEnum } from "src/app/core/enums/verification-proof.enum";

export class ProofItem {
    public percentage: number

    constructor(
        public id: number,
        public balance: number,
        public prevBalance: number,
    ) {
        if (prevBalance === 0) {
            prevBalance = balance
        }

        this.percentage = (balance / prevBalance - 1) * 100;
    }
}
export class ProofItem {
    public percentage: number

    constructor(
        public id: number,
        public balance: number,
        public prevBalance: number,
        public dateFrom: Date,
        public dateTo: Date,
    ) {
        if (prevBalance === 0) {
            prevBalance = balance
        }

        this.percentage = (balance / prevBalance - 1) * 100;
    }
}
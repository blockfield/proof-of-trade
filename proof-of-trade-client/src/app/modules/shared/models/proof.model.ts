export interface ProofModel {
    usdBalance: number
    ethBalance: number
    proofs: ProofItem[]
}

interface ProofItem {
    id: number,
    currency: string,
    action: number,
    amount: number
    nonce: number
}
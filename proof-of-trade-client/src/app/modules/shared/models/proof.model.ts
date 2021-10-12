export interface ProofModel {
    usdBalance: number
    btcBalance: number
    proofs: ProofItem[]
}

interface ProofItem {
    id: number,
    currency: string,
    action: number,
    amount: number
    nonce: number,
    price: number
}
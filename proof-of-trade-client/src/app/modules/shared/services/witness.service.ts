import { Injectable } from '@angular/core';
import { WitnessProveResult } from '../models/witness-prove-result';
import { WitnessVerifyProof } from '../models/witness-verify-proof';
import { WitnessVerify } from '../models/witness-verify';
import { WitnessProve } from '../models/witness-prove';

@Injectable({
  providedIn: 'root'
})
export class WitnessService {

  constructor() { }

  public async prove(witnessProve: WitnessProve): Promise<WitnessProveResult> {
    return (window as any).witness(witnessProve)
  }

  public async verify(verificationKey: any, verifyModel: WitnessVerify, verifyProofModel: WitnessVerifyProof): Promise<boolean> {
    return (window as any).groth16Verify(
      verificationKey,
      verifyModel.toArray(),
      verifyProofModel
    )
  }
}

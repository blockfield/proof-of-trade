import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { ProofResult } from 'src/app/api/interfaces/contract.interface';
import { WitnessModel } from '../models/witness.model';

import * as build from 'wasmsnark'
// const build = require("./wasmsnark_bn128.js");

@Injectable({
  providedIn: 'root'
})
export class WitnessService {

  constructor() {}

  public prove(witnessModel: WitnessModel, currentBlock: number): ProofResult {
    console.log('prove')
    console.log(build)
    console.log('after prove')

    // console.log(build.buildBn128)

    return new ProofResult([1, 2], [[1, 2], [3, 4]], [1, 2], [3, 4])
  }
}

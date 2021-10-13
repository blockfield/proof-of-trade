import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AssetsService {

  public verificationKey: BehaviorSubject<object|null> = new BehaviorSubject<object|null>(null)

  constructor() {
    this.initAssets()
  }

  private initAssets(): void {
    fetch("./assets/verification_key.json").then((response) => {
      return response.json();
    }).then( (b: object) => {
      this.verificationKey.next(b)
    });
  }

  public getVerificationKey(): object {
    if (!this.verificationKey.getValue()) {
      throw new Error('Verfiication key not loaded yet')
    }

    return this.verificationKey.getValue()
  }
}

import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { StateModel } from '../models/state.model';

@Injectable({
  providedIn: 'root'
})
export class MenuService {

  private stateChanged = new Subject<StateModel>()

  public stateChanged$ = this.stateChanged.asObservable()

  constructor() { }

  public changeState(state: string|null, subState: string|null = null): void {
    this.stateChanged.next(new StateModel(state, subState))
  }
}

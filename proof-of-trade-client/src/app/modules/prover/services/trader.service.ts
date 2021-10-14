import { Inject, Injectable } from '@angular/core';
import { asapScheduler, forkJoin, from, Observable, scheduled } from 'rxjs';
import { map, mergeMap, tap } from 'rxjs/operators';
import SharedConsts from 'src/app/core/consts/shared-consts';
import { SignalActionEnum } from 'src/app/core/enums/signal-action.enum';
import MathHelper from 'src/app/core/helpers/math.helper';
import { StorageService } from 'src/app/modules/shared/services/storage.service';
import { SmartContractInterface } from '../../shared/interfaces/smart-contract.interface';
import { WalletService } from '../../shared/services/wallet.service';
import { ZkService } from '../../shared/services/zk.service';
import { BalanceModel } from '../models/balance.model';
import { ProofItem } from '../models/proof-item';
import { ProofItem as SignalProofItem } from '../models/proof.model';
import { ProofModel } from '../models/proof.model';
import { ProofModel as ZkProofModel } from 'src/app/modules/shared/models/proof.model';
import { SignalModel } from '../models/signal.model';

@Injectable({
  providedIn: 'root'
})
export class TraderService {
  private signalsKey = 'signals'
  private balancesKey = 'balances'

  constructor(
    @Inject('SmartContractInterface') private contract: SmartContractInterface,
    private storageService: StorageService,
    private walletService: WalletService,
    private zkService: ZkService
  ) { }

  public addTrader(email: string): Observable<void> {
    return from(this.contract.newTrader(email))
  }

  public getStorageBalances(): Observable<{[address: string]: BalanceModel[]}> {
    return this.storageService.get<{[address: string]: BalanceModel[]}>(this.balancesKey).pipe(
      map((balances) => balances || {})
    )
  }

  public getMyStorageBalance(): Observable<BalanceModel[]> {
    return this.getStorageBalances().pipe(
      map((balances) => balances[this.walletService.getAddress()] || [new BalanceModel(SharedConsts.initialBalance, 0)])
    )
  }

  public getProofList(): Observable<ProofItem[]> {
    return from(this.getProof())
  }

  private async getProof(): Promise<ProofItem[]> {
    const trader = await this.contract.getTrader(null)

    let periodProofList = []
    for (let j = 0; j < Math.floor(trader.proofsCount / 10) + 1; j++) {
      periodProofList = [...periodProofList, ...(await this.contract.getPeriodProofsPage(trader.address, j))]
    }

    let proof: ProofItem[] = []
    let prevProofBalance = SharedConsts.initialBalance
    let prevTimestamp = await this.contract.getTimestampByBlockNumber(trader.creationBlockNumber)
    for (let i = 0; i < periodProofList.length; i++) {
      const periodProof = periodProofList[i]

      const currentTimestamp = await this.contract.getTimestampByBlockNumber(periodProof.blockNumber)

      proof.push(new ProofItem(i, periodProof.y, prevProofBalance, new Date(prevTimestamp), new Date(currentTimestamp)))

      prevProofBalance = periodProof.y
      prevTimestamp = currentTimestamp
    }

    return proof
  }

  public addSignal(signal: SignalModel, hash: string): Observable<SignalModel> {
    return this.getSignalsMap().pipe(
      tap((signalsMap) => {
        let signals = signalsMap[this.walletService.getAddress()] || []

        const unprovedCount = signals.filter(x => !x.isProved).length
        if (unprovedCount >= 2) {
          throw new Error('You need generate proof for current signals')
        }
      }),
      mergeMap(() => this.contract.addSignal(hash)),
      mergeMap(() => forkJoin({
          map: this.getSignalsMap(),
          newSignal: this.getSignalsMap().pipe(
            map((signalsMap) => {
              let signals = signalsMap[this.walletService.getAddress()]

              return !!signals ? signals.length : 0
            }),
            mergeMap((count: number) => this.contract.getSignal(this.walletService.getAddress(), count))
          )
        }).pipe(
          map((result) => {
            let signalsMap = result.map

            let signals = signalsMap[this.walletService.getAddress()]
            if (!signals) {
              signals = []
            }

            let newSignal = new SignalModel(signals.length, signal.currency, signal.amount, signal.nonce, signal.action)
            newSignal.price = MathHelper.bigIntToFloorNumber(result.newSignal.price)

            signals.push(newSignal)

            signalsMap[this.walletService.getAddress()] = signals

            return { storage: signalsMap, newSignal: newSignal}
          }),
        )
      ),
      mergeMap((result) => this.storageService.set(this.signalsKey, result.storage).pipe(
          map(() => result.newSignal)
        )
      ),
      mergeMap((newSignal) => forkJoin({
        balances: this.getStorageBalances(),
        myBalances: this.getMyStorageBalance(),
        newSignal: scheduled([newSignal], asapScheduler),
      }).pipe(
        mergeMap((data) => {
          let usd = data.myBalances.slice(-1)[0].usd
          let btc = data.myBalances.slice(-1)[0].btc

          const usdDiff = Number(data.newSignal.amount) * Number(data.newSignal.price)
          const btcDiff = data.newSignal.amount

          if (data.newSignal.action === SignalActionEnum.Buy) {
            usd -= usdDiff
            btc += btcDiff
          } else if (data.newSignal.action === SignalActionEnum.Sell) {
            usd += usdDiff
            btc -= btcDiff
          }

          data.myBalances.push(new BalanceModel(usd, btc))

          data.balances[this.walletService.getAddress()] = data.myBalances

          return this.storageService.set(this.balancesKey, data.balances).pipe(
            map(() => data.newSignal)
          )
        })
      ))
    )
  }

  public getMySignals(): Observable<SignalModel[]> {
    return this.getSignalsMap().pipe(
      map(
        (signalsMap: {[address: string]: SignalModel[]}) => signalsMap || {}
      ),
      map(
        (signalsMap: {[address: string]: SignalModel[]}) => signalsMap[this.walletService.getAddress()] || []
      ),
      map(
        (signals: SignalModel[]) => signals
      )
    )
  }

  public getNextSignalsForProof(): Observable<SignalModel[]> {
    return this.getMySignals().pipe(
      map((signals: SignalModel[]) => signals.filter(x => !x.isProved).slice(0, 2))
    )
  }

  private getSignalsMap(): Observable<{[address: string]: SignalModel[]}> {
    return this.storageService.get<{[address: string]: SignalModel[]}>(this.signalsKey).pipe(
      map((result: any) => result || {})
    )
  }

  public addPeriodProof(): Observable<void> {
    return forkJoin({
      signals: this.getNextSignalsForProof(),
      balances: this.getMyStorageBalance()
    }).pipe(
      map((result) => {
        if (result.signals.length < 2) {
          throw new Error('No signals')
        }

        let balanceIndex = Math.floor(result.signals[0].id / 2) * 2

        return new ProofModel(
          result.balances[balanceIndex].usd,
          result.balances[balanceIndex].btc,
          result.signals.map(
            (x, index) => new SignalProofItem(index, x.currency, x.action, x.amount, x.nonce, x.price)
          )
        ).toZkProofModel()
      }),
      mergeMap((model: ZkProofModel) => this.zkService.prove(model)),
      mergeMap(() => this.getSignalsMap()),
      map(
        (signalsMap) => {
          signalsMap[this.walletService.getAddress()]
            .filter(x => !x.isProved)
            .slice(0, 2)
            .every(x => x.isProved = true)

            return signalsMap
        }
      ),
      mergeMap((signalsMap) => this.storageService.set(this.signalsKey, signalsMap))
    )
  }
}

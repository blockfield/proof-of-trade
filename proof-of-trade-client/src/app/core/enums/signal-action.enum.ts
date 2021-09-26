export enum SignalActionEnum {
    Sell = 0,
    Buy = 1
}

export let actions: SignalActionEnum[] = [
    SignalActionEnum.Sell,
    SignalActionEnum.Buy,
]

export let actionsText = {
    0: "Sell",
    1: "Buy",
}
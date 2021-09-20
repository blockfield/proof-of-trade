export enum SignalActionEnum {
    Buy = 0,
    Sell = 1
}

export let actions: SignalActionEnum[] = [
    SignalActionEnum.Buy,
    SignalActionEnum.Sell,
]

export let actionsText = {
    0: "Buy",
    1: "Sell",
}
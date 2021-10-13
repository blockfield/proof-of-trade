export enum SignalStateEnum {
    Undefined = 0,
    Adding = 1,
    Successed = 2,
    Failed = 3
}

export let signalStatesText = {
    0: "Signal is undefined",
    1: "Signal is adding...",
    2: "Signal is successfully added!",
    3: "Signal adding is failed",
}
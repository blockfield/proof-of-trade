include "tradeHasher.circom";
include "../node_modules/circomlib/circuits/comparators.circom"

template Income(n) {
    signal private input type[n]; // 1 - buy, 0 - sell
    signal private input value[n];
    signal private input salt[n];
    signal private input previousBalance[2]; // USD, BTC
    signal input previousBalanceHash;
    signal input hash[n];
    signal input price[n+1]; // last price is current price
    signal output newBalanceHash;
    signal output totalBalance;

    component hasher[n+2];

    // check previous balance hash ------------------------
    hasher[n] = balanceHasher();
    hasher[n].usd <== previousBalance[0];
    hasher[n].btc <== previousBalance[1];
    previousBalanceHash === hasher[n].hash;

    // check trade hashes ---------------------------------
    for (var i = 0; i<n; i++) {
        hasher[i] = tradeHasher();
        hasher[i].type <== type[i];
        hasher[i].value <== value[i];
        hasher[i].salt <== salt[i];
        hash[i] === hasher[i].hash;
    }

    // culculate new balance ------------------------------
    signal curUSD[n+1];
    signal curBTC[n+1];
    curUSD[0] <-- previousBalance[0];
    curBTC[0] <-- previousBalance[1];
    component less[n];

    for (var i = 0; i<n; i++) {
        less[i] = LessThan(136);
        if (type[i] == 1) { //buy
            // check sufficient funds
            less[i].in[0] <-- curUSD[i]; // TODO optimize - 25% constrains
            less[i].in[1] <-- value[i]*price[i];
            less[i].out === 0;

            curUSD[i+1] <-- curUSD[i] - value[i]*price[i];
            curBTC[i+1] <-- curBTC[i] + value[i];
        } else { //sell 
            // check sufficient funds
            less[i].in[0] <-- curBTC[i]; // TODO optimize - 25% constrains
            less[i].in[1] <-- value[i];
            less[i].out === 0;

            curUSD[i+1] <-- curUSD[i] + value[i]*price[i];
            curBTC[i+1] <-- curBTC[i] - value[i];
        }
    }

    totalBalance <== curUSD[n] + curBTC[n]*price[n];

    // calculate new balance hash -------------------------
    hasher[n+1] = balanceHasher();
    hasher[n+1].usd <== curUSD[n];
    hasher[n+1].btc <== curBTC[n];
    newBalanceHash <== hasher[n+1].hash;

}

component main = Income(2)

include "../node_modules/circomlib/circuits/pedersen.circom";
include "../node_modules/circomlib/circuits/bitify.circom";

template tradeHasher() {
  signal input type;
  signal input value;
  signal input salt;
  signal output hash;

  component hasher = Pedersen(256);
  var cur = 0;
  var i;

  component b_type = Num2Bits(8);
  b_type.in <== type;
  for (i = 0; i<8; i++) {
    hasher.in[cur] <== b_type.out[i];
    cur+=1;
  }

  component b_value = Num2Bits(136);
  b_value.in <== value;
  for (i = 0; i<136; i++) {
    hasher.in[cur] <== b_value.out[i];
    cur+=1;
  }

  component b_salt = Num2Bits(112);
  b_salt.in <== salt;
  for (i = 0; i<112; i++) {
    hasher.in[cur] <== b_salt.out[i];
    cur+=1;
  }

  hash <== hasher.out[0];

}

template balanceHasher() {
  signal input usd;
  signal input btc;
  signal output hash;

  component hasher = Pedersen(256);
  var cur = 0;
  var i;

  component b_usd = Num2Bits(128);
  b_usd.in <== usd;
  for (i = 0; i<128; i++) {
    hasher.in[cur] <== b_usd.out[i];
    cur+=1;
  }

  component b_btc = Num2Bits(128);
  b_btc.in <== btc;
  for (i = 0; i<128; i++) {
    hasher.in[cur] <== b_btc.out[i];
    cur+=1;
  }

  hash <== hasher.out[0];

}

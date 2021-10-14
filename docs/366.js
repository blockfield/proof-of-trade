"use strict";(self.webpackChunkproof_of_trade_client=self.webpackChunkproof_of_trade_client||[]).push([[366],{1903:(V,m,f)=>{f.d(m,{f8:()=>H,kZ:()=>b,nY:()=>y});var H={prefix:"far",iconName:"check-circle",icon:[512,512,[],"f058","M256 8C119.033 8 8 119.033 8 256s111.033 248 248 248 248-111.033 248-248S392.967 8 256 8zm0 48c110.532 0 200 89.451 200 200 0 110.532-89.451 200-200 200-110.532 0-200-89.451-200-200 0-110.532 89.451-200 200-200m140.204 130.267l-22.536-22.718c-4.667-4.705-12.265-4.736-16.97-.068L215.346 303.697l-59.792-60.277c-4.667-4.705-12.265-4.736-16.97-.069l-22.719 22.536c-4.705 4.667-4.736 12.265-.068 16.971l90.781 91.516c4.667 4.705 12.265 4.736 16.97.068l172.589-171.204c4.704-4.668 4.734-12.266.067-16.971z"]},b={prefix:"far",iconName:"copy",icon:[448,512,[],"f0c5","M433.941 65.941l-51.882-51.882A48 48 0 0 0 348.118 0H176c-26.51 0-48 21.49-48 48v48H48c-26.51 0-48 21.49-48 48v320c0 26.51 21.49 48 48 48h224c26.51 0 48-21.49 48-48v-48h80c26.51 0 48-21.49 48-48V99.882a48 48 0 0 0-14.059-33.941zM266 464H54a6 6 0 0 1-6-6V150a6 6 0 0 1 6-6h74v224c0 26.51 21.49 48 48 48h96v42a6 6 0 0 1-6 6zm128-96H182a6 6 0 0 1-6-6V54a6 6 0 0 1 6-6h106v88c0 13.255 10.745 24 24 24h88v202a6 6 0 0 1-6 6zm6-256h-64V48h9.632c1.591 0 3.117.632 4.243 1.757l48.368 48.368a6 6 0 0 1 1.757 4.243V112z"]},y={prefix:"far",iconName:"times-circle",icon:[512,512,[],"f057","M256 8C119 8 8 119 8 256s111 248 248 248 248-111 248-248S393 8 256 8zm0 448c-110.5 0-200-89.5-200-200S145.5 56 256 56s200 89.5 200 200-89.5 200-200 200zm101.8-262.2L295.6 256l62.2 62.2c4.7 4.7 4.7 12.3 0 17l-22.6 22.6c-4.7 4.7-12.3 4.7-17 0L256 295.6l-62.2 62.2c-4.7 4.7-12.3 4.7-17 0l-22.6-22.6c-4.7-4.7-4.7-12.3 0-17l62.2-62.2-62.2-62.2c-4.7-4.7-4.7-12.3 0-17l22.6-22.6c4.7-4.7 12.3-4.7 17 0l62.2 62.2 62.2-62.2c4.7-4.7 12.3-4.7 17 0l22.6 22.6c4.7 4.7 4.7 12.3 0 17z"]}},4612:(V,m,f)=>{f.d(m,{Z:()=>h});let h=(()=>{class o{}return o.initialBalance=1e5,o.nanoBtc=1e9,o})()},3384:(V,m,f)=>{f.d(m,{Z:()=>o});var h=f(4612);class o{static numberToBigInt(z){return BigInt(z)*BigInt(h.Z.nanoBtc)}static bigIntToFloorNumber(z){return this.floorNumber(Number(z/BigInt(h.Z.nanoBtc)))}static floorNumber(z){return Math.floor(z)}}},8031:(V,m,f)=>{f.d(m,{$:()=>g});var h=f(4762),o=f(9412),v=f(3384);class z{constructor(l,c,a,r,i,n,t){this.type=l,this.value=c,this.salt=a,this.previousBalance=r,this.previousBalanceHash=i,this.hash=n,this.price=t}}class d{constructor(l,c,a,r,i,n){this.balanceHash=l,this.balance=c,this.previousBalanceHash=a,this.hashes=r,this.prices=i,this.price_now=n}toArray(){let l=[this.balanceHash,this.balance,this.previousBalanceHash];return l.push(...this.hashes,...this.prices,this.price_now),l}}var s=f(7716),u=f(6044),S=f(9358);let N=(()=>{class e{constructor(){}prove(c){return(0,h.mG)(this,void 0,void 0,function*(){return window.witness(c)})}verify(c,a,r){return(0,h.mG)(this,void 0,void 0,function*(){return window.groth16Verify(c,a.toArray(),r)})}}return e.\u0275fac=function(c){return new(c||e)},e.\u0275prov=s.Yz7({token:e,factory:e.\u0275fac,providedIn:"root"}),e})();var x=f(6215);let L=(()=>{class e{constructor(){this.verificationKey=new x.X(null),this.initAssets()}initAssets(){fetch("./assets/verification_key.json").then(c=>c.json()).then(c=>{this.verificationKey.next(c)})}getVerificationKey(){if(!this.verificationKey.getValue())throw new Error("Verfiication key not loaded yet");return this.verificationKey.getValue()}}return e.\u0275fac=function(c){return new(c||e)},e.\u0275prov=s.Yz7({token:e,factory:e.\u0275fac,providedIn:"root"}),e})(),g=(()=>{class e{constructor(c,a,r,i,n){this.contract=c,this.priceService=a,this.walletService=r,this.witnessService=i,this.assetsService=n}prove(c){return(0,o.D)(this.internalProve(c))}internalProve(c){return(0,h.mG)(this,void 0,void 0,function*(){const a=this.walletService.getAddress(),r=yield this.contract.getTradeLen(),i=yield this.contract.getSignal(a,r-2),n=yield this.contract.getSignal(a,r-1),t=v.Z.floorNumber(c.proofs[0].price),p=v.Z.floorNumber(c.proofs[1].price),M=v.Z.floorNumber(this.priceService.getBtcPrice()),C=yield this.contract.getProofLen(a);let H="16865888626473709837690039826672233841362137295365548295255658602462103516806";0!==C&&(H=yield this.contract.getPrevBalanceHash(a,C-1));let w=new z([c.proofs[0].action,c.proofs[1].action],[c.proofs[0].amount,c.proofs[1].amount],[c.proofs[0].nonce,c.proofs[1].nonce],[v.Z.floorNumber(c.usdBalance),v.Z.floorNumber(c.btcBalance)],H,[i.hash,n.hash],[t,p,M]);const A=yield this.witnessService.prove(w);yield this.contract.addPeriodProof(A,[v.Z.numberToBigInt(M)])})}verify(c,a){return(0,o.D)(this.internalVerify(c,a))}verifyAll(c,a){return(0,o.D)(this.internalVerifyAll(c,a))}internalVerifyAll(c,a){return(0,h.mG)(this,void 0,void 0,function*(){let r=!0;for(const i of a){let n=yield this.internalVerify(c,i);r=r&&n}return new Promise(i=>{i(r)})})}internalVerify(c,a){return(0,h.mG)(this,void 0,void 0,function*(){const r=yield this.contract.getPeriodProofs(c,a),i=yield this.contract.getSignal(c,2*a),n=yield this.contract.getSignal(c,2*a+1),t=v.Z.bigIntToFloorNumber(i.price),p=v.Z.bigIntToFloorNumber(n.price),M=v.Z.bigIntToFloorNumber(r.prices[0]);let C="16865888626473709837690039826672233841362137295365548295255658602462103516806";0!==a&&(C=(yield this.contract.getPeriodProofs(c,a-1)).newBalanceHash);const H=new d(r.newBalanceHash,r.y,C,[i.hash,n.hash],[t,p],M);return this.witnessService.verify(this.assetsService.getVerificationKey(),H,r.proof)})}}return e.\u0275fac=function(c){return new(c||e)(s.LFG("SmartContractInterface"),s.LFG(u.N),s.LFG(S.X),s.LFG(N),s.LFG(L))},e.\u0275prov=s.Yz7({token:e,factory:e.\u0275fac,providedIn:"root"}),e})()}}]);
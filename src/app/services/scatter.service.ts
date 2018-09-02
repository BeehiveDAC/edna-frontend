import {Injectable} from '@angular/core';
import * as Eos from 'eosjs';

@Injectable()
export class ScatterService {
  identity: any;
  eos: any;
  scatter: any;
  network: any;

  load() {
    this.scatter = (<any>window).scatter;

    this. network = {
      protocol: "https", // Defaults to https
      blockchain: "eos",
      // host: "nodes.get-scatter.com",
      host: "jungle.eosio.cr",
      port: 443,
      //port: 8888,
       //chainId: "aca376f206b8fc25a6ed44dbdc66547c36c6c33e3a119ffbeaef943642f0e906"
      chainId: "038f4b0fc8ff18a4f0842a8f0564611f6e96e8535901dd45e43ac8691a1c4dca"
    };
    if (this.scatter) {
      this.eos = this.scatter.eos(this.network, Eos, {chainId: this.network.chainId}, 'http');
    }

  }

  login() {
    this.load();
    const requirements = {accounts: [this.network]};
    if (!this.scatter) {
      alert("You need to install Scatter to use the form.");
      return;
    }
    return this.scatter.getIdentity(requirements);
  }

  logout() {
    this.scatter.forgetIdentity();
  }

  isLoggedIn() {
    return this.scatter && !!this.scatter.identity;
  }

  accountName() {
    if (!this.scatter || !this.scatter.identity) {
      return;
    }
    const account = this.scatter.identity.accounts.find(acc => acc.blockchain === 'eos');
    return account.name;
  }

  accountPermission(){
    if (!this.scatter || !this.scatter.identity) {
      return;
    }
    const account = this.scatter.identity.accounts.find(acc => acc.blockchain === 'eos');
    return account.authority
  }

  support(amount: string) {
    this.load();
    const account = this.scatter.identity.accounts.find(acc => acc.blockchain === 'eos');
    return this.eos.transfer(account.name, 'trackeraegis', amount + " EOS", 'Aegis Support');
  }

  refund() {
    this.load();
    const account = this.scatter.identity.accounts.find(acc => acc.blockchain === 'eos');
    const options = {authorization: [`${account.name}@${account.authority}`]};
    return this.eos.contract('trackeraegis').then(contract => contract.refund(account.name, options));
  }

  transfer(){
    this.load()
    const account = this.scatter.identity.accounts.find(acc => acc.blockchain === 'eos');
    const options = {authorization: [`${account.name}@${account.authority}`]};
    return this.eos.contract('eosio.token').then(contract => contract.transfer(account.name,"prasanjitkay","30.0000 EOS","memo", options));
  }

  stake(amount:string,period:number){
    this.load()
    const account = this.scatter.identity.accounts.find(acc => acc.blockchain === 'eos');
    const options = {authorization: [`${account.name}@${account.authority}`]};
    return this.eos.contract('tryednatoken').then((contract) => {
      try{
        contract.stake(account.name,period,amount, options)
      }catch(err){
        alert(err.error.what)
      }

    });
  }
  unstake(){
    this.load()
    const account = this.scatter.identity.accounts.find(acc => acc.blockchain === 'eos');
    const options = {authorization: [`${account.name}@${account.authority}`]};
    return this.eos.contract('tryednatoken').
    then((contract) => {
      try{
        contract.unstake(account.name, options)
      }catch(err){
        alert(err.error.what)
      }

    });
  }

  claim(){
    this.load()
    const account = this.scatter.identity.accounts.find(acc => acc.blockchain === 'eos');
    const options = {authorization: [`${account.name}@${account.authority}`]};
    return this.eos.contract('tryednatoken').
    then((contract) => {
      try{
        contract.claim(account.name, options)
      }catch(err){
        alert(err.error.what)
      }
    });
  }
}

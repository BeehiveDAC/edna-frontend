import { EosService } from './../services/eos.service';
import { ScatterService } from './../services/scatter.service';
import { Component, OnInit } from '@angular/core';
import { identity } from 'rxjs';
import * as Eos from 'eosjs';


@Component({
  selector: 'app-stake',
  templateUrl: './stake.component.html',
  styleUrls: ['./stake.component.css']
})
export class StakeComponent implements OnInit {
  user:any;
  balance:any;
  scatter:any;
  stakeActive:boolean = true;
  periodArray: any;
  logingText = "Login"
  selectedAmount: string;
  selectedPeriod: number;
  constructor(
    private scatterService: ScatterService,
    private eosService:EosService) {
    this.periodArray = [{label:"Weekly",value:0},{label:"Monthly",value:1},{label:"Quarterly",value:2}]
  }

  ngOnInit() {
    (<any>document).addEventListener('scatterLoaded', scatterExtension => {
      this.scatter = (<any>window).scatter;
      if(this.scatter.identity){
        console.log(this.scatter.identity)
        this.getBalance("tryednatoken","EDNA",this.scatter.identity.accounts[0].name)
        this.logingText = "Logout"
      }
      console.log("scatter called");
    })
  }

  stakeTabClicked() {
    this.stakeActive = true;
    console.log('dosomething');
  }
  unstakeTabClicked(){
    this.stakeActive=false
    console.log("unstake called");
  }
  async stake(){
    console.log("selected period",this.selectedPeriod)
    if(this.scatterService.isLoggedIn()){
      console.log("1");
      if(!this.selectedAmount){
        alert("please enter stake amount")
      }else if(!this.selectedAmount){
        alert("please choose the stake period")
      }
      else{
        this.scatterService.stake(this.selectedAmount,1)
      }
    } else{
      console.log("2")
      await this.scatterService.login()
      if(!this.selectedAmount){
        alert("pease enter stake amount")
      }else if(!this.selectedAmount){
        alert("please choose the stake period")
      }else{
        this.scatterService.stake(this.selectedAmount,1)
      }

    }

  }
  login(){
    if(this.scatterService.isLoggedIn()){
      this.scatterService.logout()
      this.logingText = "Login"
    }else{
      this.scatterService.login()
      this.logingText = "Logout"
    }
  }
  async withdraw(){
    if(this.scatterService.isLoggedIn()){
      console.log("1");
        this.scatterService.stake(this.selectedAmount,1)
    } else{
      console.log("2")
      await this.scatterService.login()
      this.scatterService.stake(this.selectedAmount,1)

    }
  }
  amountInput(value:string){
    let val = parseInt(value)
    this.selectedAmount = `${val.toFixed(4)} EDNA`
    console.log("amount input",val)
  }
  periodInput(event:any){
    console.log("period input",(this.selectedPeriod+1))
  }
  getBalance(contract: string, symbol: string, user: string) {
    this.eosService.eos.getCurrencyBalance({
      code: contract,
      symbol: symbol,
      json: true,
      account: user
    }).then((res)=>{
      if(res.length>0)
      this.balance = res[0]
      else
      this.balance = "0 EDNA"
    })
  }

}

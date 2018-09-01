import { EosService } from './../services/eos.service';
import { ScatterService } from './../services/scatter.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { identity } from 'rxjs';
import * as Eos from 'eosjs';
import { ValueTransformer } from '@angular/compiler/src/util';
import {BigNumber} from 'bignumber.js'

@Component({
  selector: 'app-stake',
  templateUrl: './stake.component.html',
  styleUrls: ['./stake.component.css']
})
export class StakeComponent implements OnInit {
  limit:number=50;
  user:any;
  balance:any;
  scatter:any;
  stakeActive:boolean = true;
  unstakeActive:boolean = false;
  claimActive:boolean = false;
  periodArray: any;
  logingText = "Logout"
  selectedAmount: string;
  selectedPeriod: number;
  date:Date=new Date();
  staked =false;
  Unstake:any;
  constructor(
    private scatterService: ScatterService,
    private eosService:EosService,
    public router:Router) {
    this.periodArray = [{label:"Weekly",value:0},{label:"Monthly",value:1},{label:"Quarterly",value:2}]
  }


   async ngOnInit() {

    (<any>document).addEventListener('scatterLoaded',async (scatterExtension) => {
      let result = await this.scatterService.load()
      if(this.scatterService.isLoggedIn()){
          console.log("1=======",this.scatterService.accountName())
          this.logingText = "Logout"
          this.getBalance("tryednatoken","EDNA",this.scatterService.accountName())
          this.getUserInfo('tryednatoken','stakes',this.encode(this.scatterService.accountName()),0);
      }else{
        this.router.navigateByUrl('home');
      }
    })
    if(this.scatterService.isLoggedIn()){
      console.log("1=======",this.scatterService.accountName())
      this.getBalance("tryednatoken","EDNA",this.scatterService.accountName())
      this.logingText = "Logout"
      this.getUserInfo('tryednatoken','stakes',this.encode(this.scatterService.accountName()),0);
  }
  }
  encode(accountName){
    let encodedName = new BigNumber(Eos.modules.format.encodeName(accountName, false))
    return encodedName.toString()
  }

  async login(){
    console.log("check")
    await this.scatterService.load()
    if(this.scatterService.isLoggedIn()){
      console.log("1=------")
      this.scatterService.logout()
      this.logingText = "Login"
      this.router.navigateByUrl('home');
    }
  }


  stakeTabClicked() {
    this.unstakeActive = false;
    this.stakeActive = true;
    this.claimActive = false
    // console.log('dosomething');
  }
  claimTabClicked(){
    this.unstakeActive = false;
    this.stakeActive = false;
    this.claimActive = true;
  }
  unstakeTabClicked(){
    this.unstakeActive = true;
    this.claimActive = false;
    this.stakeActive=false
    // console.log("unstake called");
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
        try{
          await this.scatterService.stake(this.selectedAmount,this.selectedPeriod+1)
          this.getBalance("tryednatoken","EDNA",this.scatterService.accountName())
          this.getUserInfo('tryednatoken','stakes',this.encode(this.scatterService.accountName()),0);
        }catch(err){
          console.log("inside alert")
          alert(err.error.what)
        }

      }
    } else{
      console.log("2")
      await this.scatterService.login()
      if(!this.selectedAmount){
        alert("pease enter stake amount")
      }else if(!this.selectedPeriod){
        alert("please choose the stake period")
      }else{
        this.scatterService.stake(this.selectedAmount,1)
      }

    }

  }

  async withdraw(){
    console.log("this is being called")
    if(this.scatterService.isLoggedIn()){
      console.log("1");
        this.scatterService.unstake().then((res:any)=>{
          this.getBalance("tryednatoken","EDNA",this.scatterService.accountName())
          this.getUserInfo('tryednatoken','stakes',this.encode(this.scatterService.accountName()),0);
        })

    } else{

    }
  }

  async claim(){
    if(this.scatterService.isLoggedIn()){
      console.log("1");
        await this.scatterService.claim()
        this.getBalance("tryednatoken","EDNA",this.scatterService.accountName())
          this.getUserInfo('tryednatoken','stakes',this.encode(this.scatterService.accountName()),0);
    } else{

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

  getUserInfo(contract,table,lowerBound,count){
    console.log("called------")
    this.eosService.eos.getTableRows({
      scope: contract,
      code: contract,
      table:table,
      upper_bound:-1,
      lower_bound:lowerBound,
      json: true,
      limit:1
    }).then((res)=>{
      console.log(res.rows,"--current")
      let userInfo=this.findUserDetails(res.rows);
      if(userInfo.length>0){
        console.log("printing this =============>")
        this.staked = true;
        let d = new Date(0); // The 0 there is the key, which sets the date to the epoch
        d.setUTCSeconds(userInfo[0].stake_due);
        userInfo[0].stake_due=d;
        this.Unstake=userInfo[0];
        console.log(userInfo[0],"[][][][]")
      }else{
          this.staked = false;
      }
    },(error)=>{
      console.log(error)
    })
  }

  findUserDetails(data){
    return data.filter(value => {
     return value.stake_account==this.scatterService.accountName();
    });
  }

}

import { ScatterService } from './../services/scatter.service';
import { Component, OnInit } from '@angular/core';
import { identity } from 'rxjs';
import * as Eos from 'eosjs';
import {EosService} from '../services/eos.service';

@Component({
  selector: 'app-stake',
  templateUrl: './stake.component.html',
  styleUrls: ['./stake.component.css']
})
export class StakeComponent implements OnInit {
  user:any;
  scatter:any;
  stakeActive:boolean = true;
  periodArray: any;
  logingText = "Login"
  constructor(private scatterService: ScatterService) {
    this.periodArray = [{label:"weekly",value:0},{label:"monthly",value:1},{label:"yearly",value:2}]
  }

  ngOnInit() {
    (<any>document).addEventListener('scatterLoaded', scatterExtension => {
      this.scatter = (<any>window).scatter;
      if(this.scatter.identity){
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
  stake(){
    if(this.scatterService.isLoggedIn()){
      this.scatterService.transfer()
    } else{
      this.scatterService.login()
    }

  }
  login(){
    if(this.scatterService.isLoggedIn){
      this.scatterService.logout()
      this.logingText = "Login"
    }else{
      this.scatterService.login()
      this.logingText = "Logout"
    }
  }
  withdraw(){
    console.log("enter--")
  }
}

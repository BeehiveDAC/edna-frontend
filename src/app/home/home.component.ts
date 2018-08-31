import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ScatterService } from './../services/scatter.service';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  scatter:any;
  msgs:any=[];
  constructor(public router:Router,   private scatterService: ScatterService) { }

  ngOnInit() {
    (<any>document).addEventListener('scatterLoaded', scatterExtension => {
      this.scatter = (<any>window).scatter;
    })
  }

  async checkScatterWithIdentity(){
    let result = await this.scatterService.login()
    console.log("result",result)
    if(result.accounts[0].name)
    {
      this.router.navigateByUrl('stake');
    }
    // if(this.scatter.identity){
    //   this.router.navigateByUrl('stake');
    // }else{
    //   this.msgs = [];
    //   this.msgs.push({ severity: 'error', summary: '!Oops scatter identity  not found'});
    // }
  }

}

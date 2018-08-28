import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { ChildComponent } from './child/child.component';
import { StakeComponent } from './stake/stake.component';
import { AppRoutingModule } from './/app-routing.module';
import { HomeComponent } from './home/home.component';
import {ScatterService} from './services/scatter.service';
import { EosService } from './services/eos.service';




@NgModule({
  declarations: [
    AppComponent,
    ChildComponent,
    StakeComponent,
    HomeComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    AppRoutingModule
  ],
  providers: [
    ScatterService,
    EosService,

  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

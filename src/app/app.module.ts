import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { AppRouting } from './app.routing';
import { AppComponent } from './app.component';

import {needWeb3Component} from './needWeb3/needWeb3.component';
import {networkNotSupported} from './needWeb3/network-not-supported.component'


@NgModule({
  declarations: [
    AppComponent,
    needWeb3Component,
    networkNotSupported,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    AppRouting
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

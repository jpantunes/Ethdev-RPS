import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { AppComponent } from './app.component';
import {PlayComponent} from './play/play.component'
import {ProjectComponent} from './project/project.component'
import {GameComponent} from './play/game.component'

import { AppRouting } from './app.routing';

@NgModule({
  declarations: [
    AppComponent,
    PlayComponent,
    ProjectComponent,
    GameComponent,
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

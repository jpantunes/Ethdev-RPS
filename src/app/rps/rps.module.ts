import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { RpsComponent } from './rps.component';
import {PlayComponent} from './play/play.component'
import {ProjectComponent} from './project/project.component'
import {GameComponent} from './play/game.component'

import { RpsRouting } from './rps.routing';

import {Web3Resolver} from './services/web3.resolver'

@NgModule({
  declarations: [
    RpsComponent,
    PlayComponent,
    ProjectComponent,
    GameComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    HttpModule,
    RpsRouting
  ],
  providers: [Web3Resolver],
})
export class RpsModule { }

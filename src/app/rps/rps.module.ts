import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { RpsComponent } from './rps.component';
import {PlayComponent} from './play/play.component'
import {ProjectComponent} from './project/project.component'
import {GameComponent} from './play/game.component'
import {AddCharityComponent} from './add-charity/add-charity.component'
import {NewStickerComponent} from './new-sticker/new-sticker.component'
import {MyGamesCompoent} from './my-games/my-games.component'
import {MyStickersComponent} from './my-stickers/my-stickers.component'


import { RpsRouting } from './rps.routing';

import {Web3Resolver} from './services/web3.resolver'
import {RPSResolver} from './services/rps.resolver'
import {CharitiesResolver} from './services/charities.resolver'
import {AddrResolver} from './services/addr.resolver'
import {StickersResolver} from './services/stickers.resolver'
import {MyGamesResolver} from './services/games.resolver'


@NgModule({
  declarations: [
    RpsComponent,
    PlayComponent,
    ProjectComponent,
    GameComponent,
    AddCharityComponent,
    NewStickerComponent,
    MyStickersComponent,
    MyGamesCompoent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    HttpModule,
    RpsRouting
  ],
  providers: [Web3Resolver, RPSResolver, CharitiesResolver, AddrResolver, StickersResolver, MyGamesResolver],
})
export class RpsModule { }

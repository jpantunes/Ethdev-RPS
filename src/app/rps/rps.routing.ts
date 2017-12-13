import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import {PlayComponent} from './play/play.component'
import {AddCharityComponent} from './add-charity/add-charity.component'
import {NewStickerComponent} from './new-sticker/new-sticker.component'
import {MyStickersComponent} from './my-stickers/my-stickers.component'
import {MyGamesCompoent} from './my-games/my-games.component'
import {GameComponent} from './play/game.component'
import {ProjectComponent} from './project/project.component'
import {Web3Resolver} from './services/web3.resolver'
import {RPSResolver} from './services/rps.resolver'
import { RpsComponent } from './rps.component';

import {CharitiesResolver} from './services/charities.resolver'
import {AddrResolver} from './services/addr.resolver'
import {StickersResolver} from './services/stickers.resolver'
import {MyGamesResolver} from './services/games.resolver'


const appRoutes: Routes = [
  {
    path: '',
    resolve: {
      web3 : Web3Resolver,
      rps : RPSResolver,
    },
    component: RpsComponent,
    children : [
      { path: '', component: ProjectComponent },
      {
        path: 'play',
        component: PlayComponent,
        resolve: {
          addr : AddrResolver,
          charities : CharitiesResolver,
        },
      },
      {
        path: 'play/game',
        resolve: {
          addr : AddrResolver,
          charities : CharitiesResolver,
        },
        component: GameComponent
      },
      { path: 'project', component: ProjectComponent },
      { path: 'add-charity', component: AddCharityComponent },
      { path: 'new-sticker', component: NewStickerComponent },
      {
        path: 'my-games',
        component: MyGamesCompoent,
        resolve: {
          addr : AddrResolver,
          mygames : MyGamesResolver,
        },
      },
      {
        path: 'my-stickers',
        component: MyStickersComponent,
        resolve: {
          addr : AddrResolver,
          stickers : StickersResolver,
        },
      },
    ]
  },

];

@NgModule({
  imports: [
    RouterModule.forChild(appRoutes)
  ],
  exports: [
    RouterModule
  ]
})

export class RpsRouting {}

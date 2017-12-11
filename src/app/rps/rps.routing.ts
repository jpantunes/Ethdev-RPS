import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import {PlayComponent} from './play/play.component'
import {AddCharityComponent} from './add-charity/add-charity.component'
import {GameComponent} from './play/game.component'
import {ProjectComponent} from './project/project.component'
import {Web3Resolver} from './services/web3.resolver'
import {RPSResolver} from './services/rps.resolver'
import { RpsComponent } from './rps.component';



const appRoutes: Routes = [
  {
    path: '',
    resolve: {
      web3 : Web3Resolver,
      rps : RPSResolver,
    },
    component: RpsComponent,
    children : [
      { path: '', component: PlayComponent },
      { path: 'play', component: PlayComponent  },
      { path: 'play/game', component: GameComponent  },
      { path: 'project', component: ProjectComponent },
      { path: 'add-charity', component: AddCharityComponent },
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

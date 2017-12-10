import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import {PlayComponent} from './play/play.component'
import {GameComponent} from './play/game.component'
import {ProjectComponent} from './project/project.component'
import {Web3Resolver} from './services/web3.resolver'
import { RpsComponent } from './rps.component';



const appRoutes: Routes = [
  {
    path: '',
    component: RpsComponent,
    resolve: {
      web3 : Web3Resolver
    },
    children : [
      { path: '', component: PlayComponent },
      { path: 'play', component: PlayComponent  },
      { path: 'play/game', component: GameComponent  },
      { path: 'project', component: ProjectComponent },
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

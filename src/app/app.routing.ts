import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import {PlayComponent} from './play/play.component'
import {GameComponent} from './play/game.component'
import {ProjectComponent} from './project/project.component'

const appRoutes: Routes = [
  { path: '', pathMatch: "full", redirectTo: 'project'},
  { path: 'play', component: PlayComponent  },
  { path: 'play/game', component: GameComponent  },
  { path: 'project', component: ProjectComponent },
];

@NgModule({
  imports: [
    RouterModule.forRoot(appRoutes, { enableTracing: false })
  ],
  exports: [
    RouterModule
  ]
})

export class AppRouting {}

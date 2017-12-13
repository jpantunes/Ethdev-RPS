import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import {needWeb3Component} from './needWeb3/needWeb3.component';
import {networkNotSupported} from './needWeb3/network-not-supported.component'

const appRoutes: Routes = [
  { path: '', pathMatch:'full', redirectTo: 'rps' },
  { path: 'needWeb3', component: needWeb3Component },
  { path: 'network-not-supported', component: networkNotSupported },
  { path: 'rps', loadChildren: 'app/rps/rps.module#RpsModule'  },
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

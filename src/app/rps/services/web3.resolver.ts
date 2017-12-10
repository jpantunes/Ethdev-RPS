
import { Injectable }             from '@angular/core';
import { Observable }             from 'rxjs/Observable';
import { Router, Resolve, RouterStateSnapshot,
         ActivatedRouteSnapshot } from '@angular/router';

import Web3 from 'web3';




@Injectable()
export class Web3Resolver  {
  constructor(private router: Router) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {

    if (typeof window['web3'] !== 'undefined') {
      return new Web3(window['web3'].currentProvider);
    } else {
      this.router.navigate(['/needWeb3']);
    }
  }
}


import { Injectable }             from '@angular/core';
import { Observable }             from 'rxjs/Observable';
import { Router, Resolve, RouterStateSnapshot,
         ActivatedRouteSnapshot } from '@angular/router';

const RockPaperScissorsArtifact = require('../../../../build/contracts/RockPaperScissor.json');
import contract from 'truffle-contract'
import Web3 from 'web3';




@Injectable()
export class RPSResolver  {
  constructor(private router: Router) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) : Promise<any> {

    if (typeof window['web3'] !== 'undefined') {
      let c = contract(RockPaperScissorsArtifact);
      c.setProvider(window['web3'].currentProvider)
      return c.deployed().then((instance) => {
        return instance;
      }, (a) => {
        console.log(a);
        this.router.navigate(['/network-not-supported']);
      })
    } else {
      this.router.navigate(['/needWeb3']);
    }
  }
}

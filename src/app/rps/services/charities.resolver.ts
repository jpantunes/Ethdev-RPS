
import { Injectable }             from '@angular/core';
import { Observable }             from 'rxjs/Observable';
import { Router, Resolve, RouterStateSnapshot,
         ActivatedRouteSnapshot } from '@angular/router';




@Injectable()
export class CharitiesResolver  {
  constructor(private router: Router) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot){
    let rps = route.parent.data.rps;


    return new Promise((resolve, reject) => {
      let transferEvent = rps.LogNewCharity({}, {fromBlock: 0, toBlock: 'latest'})
      transferEvent.get((error, logs) => {
        let charities = logs.map(log => {
          return {
            addr: log.args._charityAddr,
            name: window['web3'].toAscii(log.args._charityName),
          }
        });
        resolve(charities);
      });
    })

  }
}

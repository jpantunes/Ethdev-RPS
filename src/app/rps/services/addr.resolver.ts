
import { Injectable }             from '@angular/core';
import { Observable }             from 'rxjs/Observable';
import { Router, Resolve, RouterStateSnapshot,
         ActivatedRouteSnapshot } from '@angular/router';




@Injectable()
export class AddrResolver  {
  constructor(private router: Router) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot){

    return new Promise((resolve, reject) => {
      route.parent.data.web3.eth.getAccounts((err, accs) => {
        resolve(accs[0]);
      });
    });

  }
}

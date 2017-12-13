
import { Injectable }             from '@angular/core';
import { Observable }             from 'rxjs/Observable';
import { Router, Resolve, RouterStateSnapshot,
         ActivatedRouteSnapshot } from '@angular/router';

  import {SymbolsNameToId} from '../play/game.service';



@Injectable()
export class MyGamesResolver  {
  constructor(private router: Router) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot){
    let rps = route.parent.data.rps;


    return new Promise((resolve, reject) => {
      let transferEvent = rps.LogWinningCharity({}, {fromBlock: 0, toBlock: 'latest'})
      transferEvent.get((error, logs) => {

        let charities = logs.map(log => {
          return {
            p1addr: log.args._p1addr,
            p2addr: log.args._p2addr,
            seq1: log.args._p1seq.map((s) => SymbolsNameToId[window['web3'].toUtf8(s)]),
            seq2: log.args._p2seq.map((s) => SymbolsNameToId[window['web3'].toUtf8(s)])
          }
        });
        console.log(charities);
        resolve(charities);
      });
    })

  }
}

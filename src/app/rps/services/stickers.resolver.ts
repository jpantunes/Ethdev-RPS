
import { Injectable }             from '@angular/core';
import { Observable }             from 'rxjs/Observable';
import { Router, Resolve, RouterStateSnapshot,
         ActivatedRouteSnapshot } from '@angular/router';

const StickerTokenArtifact = require('../../../../build/contracts/StickerToken.json');
import contract from 'truffle-contract'
import Web3 from 'web3';




@Injectable()
export class StickersResolver  {
  constructor(private router: Router) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) : Promise<any>  {
    let rps = route.parent.data.rps;

    return new Promise((resolve, reject) => {

        rps.stikerAddr().then((stikerAddr) => {
          console.log('sticker addr', stikerAddr)
          let c = contract(StickerTokenArtifact);
          c.setProvider(window['web3'].currentProvider)
          c.at(stikerAddr).then((contract) => {

            let transferEvent = contract.LogNewSticker({}, {fromBlock: 0, toBlock: 'latest'})
            transferEvent.get((error, logs) => {

              let stickers = logs.map(log => {
                console.log(log.args);
                return log.args
              });
              resolve(stickers)
            })
          }, reject)

        }, reject)
    })

  }
}

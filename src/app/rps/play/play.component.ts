import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import {Symbols, SymbolsUrl, SymbolsList} from './game.service';

const RockPaperScissorsArtifact = require('../../../../build/contracts/RockPaperScissor.json');
import contract from 'truffle-contract'
import Web3 from 'web3';
import sha3 from 'solidity-sha3'

console.log(sha3)

@Component({
  template: `
    <h1>Select your charity</h1>
    <div *ngFor='let c of charities'>
      <p>{{c.name}} {{c.addr}}</p>
    </div>
    <div (click)='ppp()'>ppp</div>
    <h1>Select your sequence</h1>

    <div>
      <img *ngFor='let s of SymbolsList' [src]='SymbolsUrl[s]' (click)='addToSeq(s)'>
    </div>


    <p>Sequence:</p>

    <div class='sequence'>
      <div *ngFor='let s of seq' class='symbol-container'>
        <img *ngIf='s' [src]='SymbolsUrl[s]'>
      </div>
    </div>

    <button (click)='play()' type="button" class="btn btn-primary" [disabled]='!seq[4]'>Play</button>

  `,
  styleUrls: ['./play.component.scss']
})
export class PlayComponent {

  SymbolsUrl = SymbolsUrl;
  SymbolsList = SymbolsList;

  seq = new Array(5);

  web3: Web3 = null;
  rps = null;
  addr = null;
  charities : Array<any>;

  constructor(private router: Router, private activatedRoute : ActivatedRoute) {

    this.activatedRoute.data.subscribe((data: any) => {
      console.log(data);
      this.addr = data.addr;
      this.charities = data.charities;
    });
     this.rps = this.activatedRoute.parent.snapshot.data.rps;

     console.log(this.rps)
    // let RockPaperScissors = contract(RockPaperScissorsArtifact);
    // RockPaperScissors.setProvider(this.web3.currentProvider);
    //
    // console.log(RockPaperScissors);
    //
    // RockPaperScissors
    // .deployed()
    // .then(instance => {
    //   console.log(instance);
    // })

  }

  ppp() {
    let seq = ["Rock", "Paper", "Scissor", "Rock", "Rock"];
    let secret = Math.random().toString(36).substring(7);
    let addr = this.addr;

    let hash = (sha3(addr, seq, secret));

    console.log(hash, this.charities[0], addr)

    console.log(seq, this.charities[0].addr, {
      from : addr,
      value: 1000000000000000000
    });

    this.rps.playGame(seq, this.charities[0].addr, {
      from : addr,
      value: 1000000000000000000
    }).then((ok) => {
      console.log('ok', ok);
    })

  }

  addToSeq(url) {
    this.seq.unshift(url);
    this.seq.pop();
  }

  play() {
    console.log(this.seq.join(','));
    this.router.navigate(['/rps/play/game'], { queryParams: { seq: this.seq }});
  }
}

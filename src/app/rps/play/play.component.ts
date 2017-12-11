import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import {Symbols, SymbolsUrl, SymbolsList} from './game.service';

const RockPaperScissorsArtifact = require('../../../../build/contracts/RockPaperScissor.json');
import contract from 'truffle-contract'
import Web3 from 'web3';

@Component({
  template: `
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

  constructor(private router: Router, private activatedRoute : ActivatedRoute) {

    this.activatedRoute.data.subscribe((data: any) => {
      console.log(data);
    });
    // this.web3 = this.activatedRoute.snapshot.data.web3;
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

  addToSeq(url) {
    this.seq.unshift(url);
    this.seq.pop();
  }

  play() {
    console.log(this.seq.join(','));
    this.router.navigate(['/rps/play/game'], { queryParams: { seq: this.seq }});
  }
}

import { Component, NgZone} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import {Symbols, SymbolsUrl, SymbolsList, SymbolsName, SymbolsNameToId} from './game.service';

const RockPaperScissorsArtifact = require('../../../../build/contracts/RockPaperScissor.json');
import contract from 'truffle-contract'
import Web3 from 'web3';


console.log(SymbolsNameToId);

enum GameStatus {
  CHARITY,
  SEQUENCE,
  WAITTING,
  MATCH,
}

@Component({
  template: `

    <div class='choosing-charity'>
      <h1>Select your charity</h1>
      <div class='charities' *ngFor='let c of charities'>
        <div class='charity' (click)='selectCharity(c)' [class.selected]='charity == c.addr'>
          <img height='100' [src]='c.imageUrl'>
          <div class='text'>
            <p class='title'>{{c.name}}</p>
            <p>{{c.description}}</p>
          </div>
        </div>
      </div>
    </div>


    <div *ngIf='this.status >= GameStatus.SEQUENCE'>
      <h1>Select your sequence</h1>

      <div class='SymbolsList'>
        <img *ngFor='let s of SymbolsList' [src]='SymbolsUrl[s]' (click)='addToSeq(s)'>
      </div>

      <p>Sequence:</p>

      <div class='sequence'>
        <div *ngFor='let s of seq' class='symbol-container'>
          <img *ngIf='s' [src]='SymbolsUrl[s]'>
        </div>
      </div>

      <button (click)='play()' type="button" class="btn btn-primary" [disabled]='!seq[4]'>Play</button>
    </div>

    <div *ngIf='this.status == GameStatus.WAITTING'>
      <h1>waitting for an oponnent...</h1>
    </div>

  `,
  styleUrls: ['./play.component.scss']
})
export class PlayComponent {

  GameStatus = GameStatus;
  SymbolsUrl = SymbolsUrl;
  SymbolsList = SymbolsList;

  seq = new Array(5);

  web3: Web3 = null;
  rps = null;
  addr = null;
  charities : Array<any>;
  charity : null;
  event;

  status : GameStatus = GameStatus.CHARITY;

  constructor(private router: Router, private activatedRoute : ActivatedRoute, public zone: NgZone) {

    this.activatedRoute.data.subscribe((data: any) => {
      console.log(data);
      this.addr = data.addr;
      this.charities = data.charities;
    });
     this.rps = this.activatedRoute.parent.snapshot.data.rps;

    console.log(this.rps)

  }


  selectCharity(c) {
    this.charity = c.addr;
    this.status = GameStatus.SEQUENCE;
  }


  addToSeq(url) {
    this.seq.unshift(url);
    this.seq.pop();
  }

  play() {

    let seq = this.seq.map((s) => SymbolsName[s]);
    let addr = this.addr;

    console.log(seq, this.charities[0].addr, {
      from : addr,
      value: 1000000000000000000
    });

    this.status = GameStatus.WAITTING;
    this.rps.playGame(seq, this.charities[0].addr, {
      from : addr,
      value: 1000000000000000000
    }).then((ok) => {
      this.event = this.rps.LogWinningCharity();
      this.event.watch((error, result) => {
         if (!error) {
           console.log('e', result, result.args);

           this.status = GameStatus.MATCH;
           this.zone.run(() => {
             this.router.navigate(['/rps/play/game'], { queryParams:
               {
                 p1addr: result.args._p1addr,
                 p2addr: result.args._p2addr,
                 seq1: result.args._p1seq.map((s) => SymbolsNameToId[window['web3'].toUtf8(s)]),
                 seq2: result.args._p2seq.map((s) => SymbolsNameToId[window['web3'].toUtf8(s)])
               }});
           })

         }
       });
    })
  }

  ngOnDestroy() {
    if (this.event) {
      this.event.stopWatching((err) => {});
    }
  }
}

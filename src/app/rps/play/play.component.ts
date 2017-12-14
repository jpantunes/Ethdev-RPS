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
  C1,
  INTER,
  C2,
  WAITTING,
  MATCH,
}

@Component({
  template: `

    <div class='choosing-charity'>
      <h1>Select your charity</h1>
      <div class='charities' *ngFor='let c of charities'>
        <div class='charity' (click)='selectCharity(c)' [class.selected]='charity == c.addr'>
          <img height='100' src='https://image.freepik.com/free-vector/charity-hands_1025-146.jpg'>
          <div class='text'>
            <p class='title'>{{c.name}}</p>
            <p>{{c.description}}...</p>
          </div>
        </div>
      </div>
    </div>


    <div *ngIf='this.status >= GameStatus.SEQUENCE'>
      <hr/>
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
      <br />

      <div *ngIf='this.status == GameStatus.SEQUENCE'>
        <button (click)='play()' type="button" class="btn btn-primary" [disabled]='!seq[4]'>Play</button>
        <p>Note: this is a beta, play request and reveal secret will happen subsequently</p>
      </div>
    </div>


    <div *ngIf='this.status == GameStatus.C1'>
      <h1>waitting for sequence to be mined...</h1>
    </div>

    <div *ngIf='this.status == GameStatus.INTER'>
      <h1>sending reveal now...</h1>
    </div>

    <div *ngIf='this.status == GameStatus.C2'>
      <h1>waitting for secret to be mined....</h1>
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

  async play() {

    let seq = this.seq.map((s) => SymbolsName[s]);
    let addr = this.addr;
    let secret = Math.random().toString(36).substring(7);

    console.log('preHashTest', addr, seq, secret);
    let hash = await this.rps.preHashTest.call(addr, seq, secret);


    this.status = GameStatus.C1;

    console.log('hash', hash);

    console.log('setupGame', hash, this.charity);

    let setup = await this.rps.setupGame(hash, this.charity,  {
     from : addr,
     value: 100000000000000000
    });


    this.status = GameStatus.INTER;

    console.log(setup);

    console.log('playGame', seq, secret);


    this.event = this.rps.LogWinningCharity();
    this.event.watch((error, result) => {
      console.log(error, result)
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


    this.status = GameStatus.C2;

    let res = await this.rps.playGame(seq, secret, {from : addr});

    this.status = GameStatus.WAITTING;

    console.log(res);








    // console.log(seq, this.charities[0].addr, {
    //   from : addr,
    //   value: 1000000000000000000
    // });
    //
    // this.status = GameStatus.WAITTING;
    // this.rps.playGame(seq, this.charities[0].addr, {
    //   from : addr,
    //   value: 1000000000000000000
    // }).then((ok) => {
    //   this.event = this.rps.LogWinningCharity();
    //   this.event.watch((error, result) => {
    //      if (!error) {
    //        console.log('e', result, result.args);
    //
    //        this.status = GameStatus.MATCH;
    //        this.zone.run(() => {
    //          this.router.navigate(['/rps/play/game'], { queryParams:
    //            {
    //              p1addr: result.args._p1addr,
    //              p2addr: result.args._p2addr,
    //              seq1: result.args._p1seq.map((s) => SymbolsNameToId[window['web3'].toUtf8(s)]),
    //              seq2: result.args._p2seq.map((s) => SymbolsNameToId[window['web3'].toUtf8(s)])
    //            }});
    //        })
    //
    //      }
    //    });
    // })
  }

  ngOnDestroy() {
    if (this.event) {
      this.event.stopWatching((err) => {});
    }
  }
}

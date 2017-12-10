import { Component } from '@angular/core';
import { Router } from '@angular/router';

import {Symbols, SymbolsUrl, SymbolsList} from './game.service';

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

  constructor(private router: Router) {

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

import { Component,ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import {Symbols, SymbolsUrl, SymbolsList, SymbolsName} from './game.service';


@Component({
  template: `

    <div class='sequence'>
      {{p1addr == addr ? 'Me' : p1addr}}
      <div *ngFor='let s of seq1' class='symbol-container'>
        <img *ngIf='s' [src]='SymbolsUrl[s]'>
      </div>
      {{playerOneScore}}
    </div>

    <div class='sequence'>
      {{p2addr == addr ? 'Me' : p2addr}}
      <div *ngFor='let s of seq2' class='symbol-container'>
        <img *ngIf='s' [src]='SymbolsUrl[s]'>
      </div>
      {{playerTwoScore}}
    </div>

    <div #rps></div>
  `,
    styleUrls: ['./game.component.scss']
})
export class GameComponent {

  @ViewChild('rps') rps: ElementRef
  addr;
  charities;

  p1addr;
  p2addr;

  seq1 : Array<any>;
  seq2 : Array<any>;
  playerOneScore = 0;
  playerTwoScore = 0;
  SymbolsUrl = SymbolsUrl;


  game : any = null;
  oponnentSeq = [
    Symbols.ROCK,
    Symbols.PAPER,
    Symbols.ROCK,
    Symbols.SCISSOR,
    Symbols.SCISSOR
    ]

    constructor(private activatedRoute : ActivatedRoute) {

      this.activatedRoute.data.subscribe((data: any) => {
        this.addr = data.addr.toLocaleLowerCase();
        this.charities = data.charities;
      });

      this.activatedRoute.queryParams.subscribe((data: any) => {
        this.seq1= data.seq1;
        this.seq2 = data.seq2;
        this.p1addr = data.p1addr.toLocaleLowerCase();
        this.p2addr = data.p2addr.toLocaleLowerCase();
      });
    }

  ngAfterViewInit() {
    this.game = new Phaser.Game(400, 300, Phaser.AUTO, this.rps.nativeElement, this, true);
  }

  preload(game) {
    SymbolsList.forEach((sym) => game.load.image('symbol-' + sym , SymbolsUrl[sym]) );
  }

  shake(game, sprite, height : number) {

    return (new Promise((resolve, reject) => {
      var bounce=game.add.tween(sprite);

      bounce.to({ y: sprite.y + height }, 200, Phaser.Easing.Sinusoidal.In, true, 0 , 2, true);
      bounce.onComplete.add(function(){
        resolve();
      }, this);
    }));

  }


    fade(game, sprite, height : number) {

      return (new Promise((resolve, reject) => {
        var fade=game.add.tween(sprite);

        fade.to({alpha: 0}, 300, Phaser.Easing.Linear.None, true, 0, 0, true);
        fade.onComplete.add(function(){
          resolve();
        }, this);
      }));

    }

  async create(game) {

    let sequence = this.seq1;
    let sequence2 = this.seq2;


    for (let i = 0; i < sequence.length; i++) {

        var SymA = game.add.sprite(50, (game.world.height / 2) - 50, 'symbol-' + sequence[i]);
        var SymB = game.add.sprite(game.world.width - 50, (game.world.height / 2) - 50, 'symbol-' + sequence2[i]);

        SymB.scale.x = -1;

        await Promise.all([this.shake(game,SymB,40), this.shake(game,SymA,40)]);

        this.score(SymbolsName[sequence[i]], SymbolsName[sequence2[i]])

        if (i  < sequence.length - 1) {
          await Promise.all([this.fade(game,SymB,40), this.fade(game,SymA,40)]);

          SymA.destroy();
          SymB.destroy();
        }

    }

  }

  score(playerOne, playerTwo) {
    if (playerOne == playerTwo) {
        return;
    } else if (playerOne == "Rock" && playerTwo == "Scissor") {
        this.playerOneScore ++;
    } else if (playerOne == "Rock" && playerTwo == "Paper") {
        this.playerTwoScore ++;
    } else if (playerOne == "Paper" && playerTwo == "Rock") {
        this.playerOneScore ++;
    } else if (playerOne == "Paper" && playerTwo == "Scissor") {
        this.playerTwoScore ++;
    } else if (playerOne == "Scissor" && playerTwo == "Paper") {
        this.playerOneScore ++;
    } else if (playerOne == "Scissor" && playerTwo == "Rock") {
        this.playerTwoScore ++;
    }
  }

  ngOndestroy() {
    if (this.game) {
      this.game.destroy();
    }
  }
}

import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import {Symbols, SymbolsUrl, SymbolsList} from './game.service';


@Component({
  template: `
    <div id='rps'></div>
  `,
})
export class GameComponent {

  game : any = null;
  oponnentSeq = [
    Symbols.ROCK,
    Symbols.PAPER,
    Symbols.ROCK,
    Symbols.SCISSOR,
    Symbols.SCISSOR
    ]

  constructor(private route: ActivatedRoute) {}

  ngAfterViewInit() {
    this.game = new Phaser.Game(300, 200, Phaser.AUTO, 'rps', this, true);
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

  async create(game) {

    let sequence = this.route.snapshot.queryParams.seq;

    for (let i = 0; i < sequence.length; i++) {

        var SymA = game.add.sprite(50, (game.world.height / 2) - 50, 'symbol-' + sequence[i]);
        var SymB = game.add.sprite(game.world.width - 50, (game.world.height / 2) - 50, 'symbol-' + this.oponnentSeq[i]);

        SymB.scale.x = -1;

        await Promise.all([this.shake(game,SymB,40), this.shake(game,SymA,40)]);

        SymA.destroy();
        SymB.destroy();

    }

  }

  ngOndestroy() {
    if (this.game) {
      this.game.destroy();
    }
  }
}

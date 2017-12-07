import { Component } from '@angular/core';


@Component({
  template: `
    <div id='rps'></div>
  `,
})
export class PlayComponent {

  game : any = null;

  ngAfterViewInit() {
    this.game = new Phaser.Game(400, 300, Phaser.AUTO, 'rps', this, false);
  }

  preload(game) {
    game.load.image('rock','assets/rock.png');
    game.load.image('paper','assets/paper.png');
    game.load.image('scissor','assets/scissor.png');
  }

  shake(game, sprite, height : number) {
    var bounce=game.add.tween(sprite);

    bounce.to({ y: sprite.y + height }, 200, Phaser.Easing.Sinusoidal.In, true, 0 , 2, true);
    bounce.onComplete.add(function(){}, this);
  }

  create(game) {
    var rock = game.add.sprite(50, game.world.height / 2, 'rock');
    var paper = game.add.sprite(game.world.width - 100, game.world.height / 2, 'paper');

    paper.scale.x = -1;
    //paper.anchor.setTo(.5, 1);

    this.shake(game,rock,40);
    this.shake(game,paper,40);

  }




  ngOndestroy() {
    if (this.game) {
      this.game.destroy();
    }
  }
}

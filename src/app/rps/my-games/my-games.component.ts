import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  template:`
    <h1>My games</h1>

    <div *ngFor='let game of games; let i = index'>
      <p (click)='replay(game)'>replay game {{i + 1}}</p>
    <div>

  `
})
export class MyGamesCompoent {

  games : Array<any> = [];

  constructor(private router: Router, private activatedRoute : ActivatedRoute) {

    this.activatedRoute.data.subscribe((data: { mygames : Array<any>, addr: string}) => {
      console.log('ok',  data.mygames, data.addr)
        this.games = data.mygames.filter((s) => s.p1addr.toLowerCase() == data.addr.toLowerCase() ||  s.p2addr.toLowerCase() == data.addr.toLowerCase());
    });

  }


  replay(game) {
    this.router.navigate(['/rps/play/game'], { queryParams: game });
  }



}

import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  template:`
    <h1>My stickers</h1>

    <p>you have {{stickers.length}} stickers</p>

  `
})
export class MyStickersComponent {

  stickers : Array<any> = [];

  constructor(private router: Router, private activatedRoute : ActivatedRoute) {

    this.activatedRoute.data.subscribe((data: { stickers : Array<any>, addr: string}) => {
      console.log('ok',  data.stickers, data.addr)
      this.stickers = data.stickers.filter((s) => s._owner.toLowerCase() == data.addr.toLowerCase());
    });

  }



}

import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  template:`
    <div class="alert alert-warning" role="alert">For contract owner only, contract will fail otherwise</div>

    <h1>Create a new sticker</h1>

    <button (click)='sticker()' class="btn btn-success">new sticker</button>
  `
})
export class NewStickerComponent {

  rps = null;
  web3 = null;

  constructor(private router: Router, private activatedRoute : ActivatedRoute) {
    this.activatedRoute.parent.data.subscribe((data: { rps : any , web3 : any}) => {
      this.rps = data.rps;
      this.web3 = data.web3;
    });
  }

  sticker(data) {

    this.web3.eth.getAccounts((err, accs) => {
      console.log(err, accs);
      console.log('newStickerAddr', {from : accs[0]});
      this.rps.newStickerAddr({from : accs[0]}).then((a) =>{
        alert('sticker created!');
      })
    });
  }

}

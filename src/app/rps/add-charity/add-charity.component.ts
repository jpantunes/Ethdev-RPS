import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  template:`
    <h1>Add a charity</h1>
    <form (ngSubmit)="onSubmit(heroForm)" #heroForm="ngForm">
      <div class="form-group">
        <label for="name">Name</label>
        <input type="text" ngModel name='name'  #name='ngModel' class="form-control" id="name" required>
      </div>

      <div class="form-group">
        <label for="alterEgo">Adress</label>
        <input type="text" ngModel name='addr'  #addr='ngModel' class="form-control" id="alterEgo">
      </div>

      <button type="submit" class="btn btn-success">Submit</button>

      </form>
  `
})
export class AddCharityComponent {

  rps = null;
  web3 = null;

  constructor(private router: Router, private activatedRoute : ActivatedRoute) {
    this.activatedRoute.parent.data.subscribe((data: { rps : any , web3 : any}) => {
      console.log(data);
      this.rps = data.rps;
      this.web3 = data.web3;
    });
  }

  onSubmit(data) {
    if(data.valid) {
      console.log(data.value)
      this.web3.eth.getAccounts((err, accs) => {
        console.log(err, accs);
        this.rps.addCharity(data.value.name, data.value.addr, {from : accs[0]}).then((a) =>{
          console.log(a);
        })
      });
    }
  }
}

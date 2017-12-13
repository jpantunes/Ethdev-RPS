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
        <label for="addr">Adress</label>
        <input type="text" ngModel name='addr'  #addr='ngModel' class="form-control" id="addr">
      </div>

      <div class="form-group">
        <label for="description">description</label>
        <input type="text" ngModel name='description'  #description='ngModel' class="form-control" id="description">
      </div>

      <div class="form-group">
        <label for="imageUrl">imageUrl</label>
        <input type="text" ngModel name='imageUrl'  #imageUrl='ngModel' class="form-control" id="imageUrl">
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
      this.rps = data.rps;
      this.web3 = data.web3;
    });
  }

  onSubmit(data) {
    if(data.valid) {
      console.log(data.value)
      this.web3.eth.getAccounts((err, accs) => {
        console.log(err, accs);
        console.log('addCharity', data.value.addr, data.value.name, data.value.description, data.value.imageUrl, {from : accs[0]});
        this.rps.addCharity(data.value.addr, data.value.name, data.value.description, data.value.imageUrl, {from : accs[0]}).then((a) =>{
          console.log(a);
        })
      });
    }
  }
}

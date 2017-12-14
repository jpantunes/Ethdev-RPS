import { Component } from '@angular/core';

@Component({
  template:`
    <img width='300' src='https://ih1.redbubble.net/image.101121317.0149/pp,550x550.u2.jpg'>
    <p>your network is not supported switch and try rinkeby or local. <a class="nav-link" routerLink="/" >try again</a>  </p>
  `
})
export class networkNotSupported {
}

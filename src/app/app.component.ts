import { Component, ViewEncapsulation} from '@angular/core';

@Component({
  selector: 'app',
  encapsulation: ViewEncapsulation.None,
  template:`
  <section class="content-area site-content">
    <router-outlet></router-outlet>
  </section>
  `
})
export class AppComponent {}
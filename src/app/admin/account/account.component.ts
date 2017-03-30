import { 
  Component, 
  OnInit,
  ViewEncapsulation,
  ChangeDetectionStrategy
} from '@angular/core';

@Component({
  selector: 'user-account',
  encapsulation:ViewEncapsulation.Emulated,
  changeDetection:ChangeDetectionStrategy.OnPush, //only checkOne
  template:`
    <p>
      account works!
    </p>
  `,
  styles: []
})
export class UserAccountComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}

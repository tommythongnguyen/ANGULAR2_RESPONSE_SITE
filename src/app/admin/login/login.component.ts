import { Component, OnInit, ViewEncapsulation, ChangeDetectionStrategy, HostListener, ElementRef} from '@angular/core';
import { animate, state, style, transition, trigger } from "@angular/animations";

import{FormGroup,FormControl, FormBuilder,Validators} from '@angular/forms';
import {Router, ActivatedRoute} from'@angular/router';

import { AdminService, IError, Error_Enum, FormMessageService } from '../services';

import {validateEmail} from '../../shared';
const MESSAGES = {
  'email': {
    'required': 'username is required',
    'email': 'email is invalid'
  },
  'password': {
    'required': 'password is required'
  }
}
@Component({
  selector: 'user-login',
  encapsulation:ViewEncapsulation.Emulated,
  //changeDetection:ChangeDetectionStrategy.OnPush, //only checkOne
  templateUrl:'./login.component.html',
  styleUrls: ['./login.component.scss'],
  host:{
    '[@focusTrigger]':'isFocus'
  },
  animations: [trigger(
    'focusTrigger',
    [
      state('true', style({height: '50px', backgroundColor:'blue'})),
      state('false',style({height: '40px', backgroundColor:'white'})),
      transition('*<=>*',animate('500ms'))
    ])
  ]
})
export class UserLoginComponent implements OnInit {
  public isLoading: boolean = false;

  public isError:boolean=false;
  public errorMessage:string;
  public loginForm:FormGroup;
  public isFocus:boolean=false;
  private _formMessage = new FormMessageService(MESSAGES);
  public formErrors = {};
  constructor(private _adminService: AdminService, private _router: Router, private _activatedRoute: ActivatedRoute, private _elementRef: ElementRef) {
    this.errorMessage='';
  }
  @HostListener('focus')
  onFocus(){
    console.log('focus');
    this.isFocus=true;
  }
  @HostListener('blur')
  onBlur(){
    console.log('blur');
    this.isFocus=false;
  }
  ngOnInit() {
    this.loginForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required]),
      rememberMe: new FormControl()
    });
    this.loginForm.valueChanges.subscribe(data => this.onValueChanges(data));
  }

  public onValueChanges(data): void {
    this.formErrors = this._formMessage.getFormError(this.loginForm);
  }
  submit(form):void{
    this.isError = false;
    this.isLoading = true;
    this._adminService.login({ email: form.email, password: form.password, rememberMe: !!form.rememberMe })
                      .subscribe(
                      next => {
                        this.isError = false;
                        this.isLoading = false;
                        this._router.navigate(['/pages']);
                      },
                      (error: IError) => {
                          console.log('error: ', error);
                          if (error && error.type === Error_Enum.MIS_MATCH) {
                            this.errorMessage = error.message;
                          } else if (error && error.type === Error_Enum.UNREGISTERED) {
                            this.errorMessage = error.message;
                          }
                          this.isError = true;
                          this.isLoading = false;
                        }
                      );
  }
}

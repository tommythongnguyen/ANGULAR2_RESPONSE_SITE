import {Component,ChangeDetectionStrategy,ViewEncapsulation,OnInit,OnDestroy}from '@angular/core';
import {FormControl,FormGroup,FormGroupName,Validators}from '@angular/forms';
import {Router, ActivatedRoute} from '@angular/router';

import { AdminService, ICredential, FormMessageService } from '../services';
import {validateEmail} from '../../shared';

const MESSAGES = {
    'email': {
        'required': 'email is required',
        'validateEmail': 'email is invalid'
    },
    'password': {
        'required': 'password is required',
        'minlength': 'password must be at least 6 characters long',
        'maxlength': 'password cannot be more than 10 character long'
    },
    'confirmPassword': {
        'required': 'password is required',
        'equalsTo': 'password doesnot match'
    }
};

@Component({
    selector:'user-register',
    encapsulation:ViewEncapsulation.Emulated,
    changeDetection:ChangeDetectionStrategy.OnPush,
    templateUrl:'./register.component.html',
    styleUrls:['./register.component.scss']
})
export class UserRegisterComponent implements OnInit, OnDestroy{
    private _submitted:boolean=false;
    public registerForm:FormGroup;
    private _subscription:any;
    private _formMessage = new FormMessageService(MESSAGES);
    private formErrors = {};
    private isLoading: boolean = false;

    constructor(private _adminService: AdminService,
                 private _router:Router,
                 private _activatedRoute:ActivatedRoute){}
    ngOnInit(): void {
        this.buildForm();
    }
    ngOnDestroy(){
        if(this._subscription){
            this._subscription.unsubscribe();
        }
    }

    buildForm(): void {
        this.registerForm = new FormGroup({
            name: new FormGroup({
                firstname: new FormControl('', [Validators.required]),
                lastname: new FormControl('', [Validators.required])
            }),
            email: new FormControl('', [Validators.required, validateEmail]),
            password: new FormControl('', [Validators.required, Validators.minLength(6), Validators.maxLength(10)]),
            confirmPassword: new FormControl('')
        });

        this.registerForm.valueChanges.subscribe(data => this.onValueChanges(data));
    }

    onValueChanges(data: any) {
        this.formErrors = this._formMessage.getFormError(this.registerForm);
    }
    submit(formValue){
        this.isLoading = true;
        this._subscription = this._adminService.register({ email: formValue.email, password: formValue.password })
            .subscribe(
                next => {
                    this.isLoading = false;
                    this._submitted = true;
                    this._router.navigate(['/pages'], { relativeTo: this._activatedRoute });
                },
                error => {
                    console.log('error: ', error);
                    this.isLoading = false;
                    this._submitted = false;
                }
            );
    }

    hasChange():boolean{
        return this.registerForm.dirty && !this._submitted;
    }

}
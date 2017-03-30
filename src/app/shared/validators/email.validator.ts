import {NG_VALIDATORS, FormControl, Validator} from '@angular/forms';
import {forwardRef, Directive}from '@angular/core';

export function validateEmail(control:FormControl):{[key:string]:any}{
    const EMAIL_REGEXP =  /^[a-z0-9!#$%&'*+\/=?^_`{|}~.-]+@[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)*$/i;
    if(control.value){
        return EMAIL_REGEXP.test(control.value)? null:{
            validateEmail:{
                valid:false
            }
        };
    }
    return null;   
}

export const NG_EMAIL_VALIDATOR ={
    provide: NG_VALIDATORS,
    useExisting:forwardRef(()=>TEmailValidator),
    multi:true
};
@Directive({
    selector:'[type=email][validateEmail][ngModel],[type=email][validateEmail][formControl], [type=email][validateEmail][formControlName]'
})
export class TEmailValidator implements Validator{
    validate(c:FormControl):{[key:string]:any}{
        return validateEmail(c);
    }
}
import{CanDeactivate}from '@angular/router';
import {UserRegisterComponent} from '../register/register.component';
export class CancelRegisterGuard implements CanDeactivate<UserRegisterComponent>{
    canDeactivate(target:UserRegisterComponent):boolean{
        if(target.hasChange()){
            return window.confirm('Do you really want to cancel?');
        }
        return true;
    }
}
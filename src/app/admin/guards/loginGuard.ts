import {CanActivate, RouterStateSnapshot, ActivatedRouteSnapshot, Router} from '@angular/router';
import {Injectable} from '@angular/core';
import {AdminService} from '../services';
import {Observable} from 'rxjs/Rx';
@Injectable()
export class LoginGuard implements CanActivate{
    constructor( private _adminSerive:AdminService, private _router:Router){}
    canActivate(route:ActivatedRouteSnapshot, state: RouterStateSnapshot){
        //make the ajax call in the real application
        return this._adminSerive.isLogined()
                                     .map(logined=>{
                                         if (logined) {
                                             this._router.navigate(['/dashboard']);
                                             return false;
                                         }
                                         return true;
                                     })
                                     .catch(()=>{
                                         console.log('some error happen');
                                         //this._router.navigate(['/admin/login']);
                                         return Observable.of(true);
                                     });
    }
}
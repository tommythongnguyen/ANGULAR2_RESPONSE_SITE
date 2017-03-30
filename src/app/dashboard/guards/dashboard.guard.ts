import {CanActivate, Router, RouterStateSnapshot, ActivatedRouteSnapshot} from '@angular/router';
import { Injectable } from '@angular/core';
import { AdminService } from '../../admin/services';
import { Observable } from 'rxjs/Observable';
import { DashboardComponent} from '../dashboard.component';

@Injectable()
export class CanActivateDashboard implements CanActivate{
	constructor(private _adminService:AdminService, private _router:Router){}
	canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot){
		//make the ajax call in the real application
		return this._adminService.isLogined()
									  .map(logined=>{
										  if (!logined){
										  	//reroute to login page
											  console.log('in');

											  this._router.navigate(['/admin/login']);
											  return false;
										  }
										  console.log('out');
										  return true;
									  })
									 .catch(() => {
										console.log('something is not right');
										this._router.navigate(['/admin/login']);
										return Observable.of(false);
									  })
	}
}
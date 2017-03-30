import {Routes} from '@angular/Router';
import {UserLoginComponent} from './login/login.component';
import {UserRegisterComponent} from './register/register.component';
import {UserAccountComponent} from './account/account.component';
import { CancelRegisterGuard, LoginGuard } from './guards';
export const ROUTES: Routes=[
	    {path:'admin', children:[
			{path:'', redirectTo:'login', pathMatch:'full'},
			{	path:'login', 
				component:UserLoginComponent,
				canActivate: [LoginGuard]
			},
			{	path:'register',
				component:UserRegisterComponent,
				canDeactivate:[CancelRegisterGuard]
			},
			{path:'account', component: UserAccountComponent},
		    {path:'**', redirectTo:'login', pathMatch:'full'}
	]},
];

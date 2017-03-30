import {Routes} from '@angular/router';
import { CanActivateDashboard } from './guards';
import { DashboardComponent } from './dashboard.component';
import { HomePageComponent } from './home';
import { AlbumPageComponent } from './album';
import { MediaPageComponent } from './media';
import {AboutPageComponent} from './about';
export const ROUTES:Routes=[
	{	path:'', 
		component:DashboardComponent,
		//canActivate: [CanActivateDashboard],
		children:[
			{path:'', redirectTo:'home', pathMatch:'full'},
			{ path: 'home', component: HomePageComponent },
			{ path: 'album', component: AlbumPageComponent },
			{ path: 'media', component: MediaPageComponent },
			{ path: 'about', component: AboutPageComponent }
		]
	}
]
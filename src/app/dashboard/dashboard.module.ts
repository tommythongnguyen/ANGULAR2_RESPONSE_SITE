import { NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import { RouterModule} from '@angular/router';
import { Http } from '@angular/http';
//-----import shared Component-----------
import { SharedComponentModule } from '../shared';

//-----import Dashboard ROUTES---------
import { ROUTES } from './dashboard.routes';

//---import pages component------
import { DashboardComponent } from './dashboard.component';
import { HomePageComponent } from './home';
import { AlbumPageComponent } from './album';
import { MediaPageComponent } from './media';
import { AboutPageComponent } from './about';
//-----import service-----
import { DashboardHttpService, DashboardDataService, API_URL} from './services';
//-----import dashboard guard-------
import { CanActivateDashboard } from './guards';

export function DashBoardHttpServiceFactory(http, apiUrl) {
	return new DashboardHttpService(http, apiUrl);
}

const directives = [
	DashboardComponent,
	HomePageComponent,
	AlbumPageComponent,
	MediaPageComponent,
	AboutPageComponent
];

@NgModule({
	declarations:[...directives],
	imports:[
		CommonModule,
		RouterModule.forChild(ROUTES),
		SharedComponentModule
	],
	providers: [
		DashboardDataService,
		CanActivateDashboard,
		{ provide: API_URL, useValue: './assets/jsons/' },
		{
			provide: DashboardHttpService,
			useFactory: DashBoardHttpServiceFactory,
			deps: [Http, API_URL]
		}
	]
})
export class DashboardModule{}
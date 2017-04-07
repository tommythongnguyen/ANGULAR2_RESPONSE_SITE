import { Component, OnInit} from '@angular/core';
import { DashboardHttpService } from '../services';
import { Observable } from 'rxjs/Observable';
@Component({
	selector: 'home-page',
	styles:[`
		.carousel-container{
			min-height:200px;
		}
	`],
	template:`
		<jumbotron side="center">
			<page-title title="Home"></page-title>
			<div class="carousel-container"[loading]="isLoading" appendTo="self" spinner="show">
				<carousel [slideTmpl]="slideTmpl" [slides]="slides" autoTiming="2000" >
					<ng-template #slideTmpl let-imgSrc="src">
				 		<img class="d-block img-fluid" src="{{imgSrc}}" alt="" width="100%" height="auto">
					</ng-template>
				</carousel>
			</div>	
		</jumbotron>
	`
})
export class HomePageComponent implements OnInit {
	public slides:any[];
	public isLoading = false;
	constructor(private _dashboardHttpService: DashboardHttpService) { }

	ngOnInit() {
		this.isLoading = true;
		this._dashboardHttpService.getDashboardData('carousel')
			.subscribe(
			data => { 
				this.slides = data;
				this.isLoading = false;
			},
				error=> console.log('error: ',error)
			)
	}
}
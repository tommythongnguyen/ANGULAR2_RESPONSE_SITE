import { Component, OnInit, ChangeDetectionStrategy} from '@angular/core';
import {Router} from '@angular/router';
import { DashboardHttpService } from '../services';
import { Observable } from 'rxjs/Observable';
@Component({
	selector: 'demo-page',
	//changeDetection:ChangeDetectionStrategy.OnPush
	styleUrls:['./demo-page.component.scss'],
	template:`
		<section class="demo-page">
			<aside class="layout-sidebar" [loading]="isLoading"  spinner="show">
				<accordion activeTabNumber="0">
					<accordion-tab *ngFor="let group of groups"
						[title]="titleTmpl" [titleContext]="group" globalClass="demo-page-aside">
						<ul>
							<li *ngFor="let item of group.components">
								<a href="#" [routerLink]="['./',item.url]" routerLinkActive="active">{{item.name}}</a>
							</li>
						</ul>
					</accordion-tab>
				</accordion>

				<ng-template #titleTmpl let-title="groupTitle" let-icon ="groupIcon">
					<i [ngClass]="icon" aria-hidden="true"></i>
					<span>{{title}}</span>
				</ng-template>
			</aside>
			<section class="layout-content">
				<router-outlet></router-outlet>
			</section>
		</section>
	`
})
export class DemoPageComponent implements OnInit{
	private isLoading: boolean = false;
	//public groups: Observable<any[]>;
	public groups: any[] = [];
	constructor(private _dashboardHttpService: DashboardHttpService, private _router: Router) { }
	ngOnInit(){
		this.isLoading = true;
		this._dashboardHttpService.getDashboardData("components")
			.subscribe(
			res => {
				console.log('res:', res);
				this.groups = res;
			},
			err => {
				console.log('err:', err)
			},
			() => { this.isLoading = false; }
			);
		this._router.events.subscribe(
			ev => { console.log('ev:', ev) }
		)	
	}
}
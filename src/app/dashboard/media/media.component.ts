import { Component, OnInit , ViewChild, AfterViewInit, TemplateRef} from '@angular/core';
import { DashboardHttpService } from '../services';
import { Observable } from 'rxjs/Observable';
@Component({
	selector: 'media-page',
	styleUrls:['./media.component.scss'],
	template:`
		<section>
			<jumbotron side="center">
			    <page-title title="Media"></page-title>
			    <section class=".jumb-body">
			        <img src="./assets/graphics/background/media.jpg" width="100%">
			    </section>
			</jumbotron>
		
			<section role="tabpanel" class="tab-panel">
				<tabs (onSelect)="selectTab($event)" activeTab='Music'>
					<tab *ngFor="let item of tabList" [tab]="item"></tab>
					<tab-content [list]="TabData" [templf]='_embededTemplf' [showLoading]="isLoading"></tab-content>
				</tabs>
			</section>

			<ng-template #audioPlayerTempl let-list="list">
						   <audio-player [tracks]="selectedTracks"></audio-player>
						   <article class="row justify-content-center trackAlbums">
								<card *ngFor="let album of list" [card]="album" class="col-sm-5 col-lg-4" (onSelectCard)="switchAlbum($event)"></card>
						   </article>
						   
			</ng-template>
		</section>
	`
})
export class MediaPageComponent implements OnInit, AfterViewInit {
	public selectedTracks = [];
	private _embededTemplf: TemplateRef<any>;
	@ViewChild('audioPlayerTempl') audioPlayerTemplate: TemplateRef<any>;
	isLoading = false;
	public tabList = [
		{ header: 'Music' },
		{ header: 'Movie' },
		{ header: 'Comedy' },
		{ header: 'Collection' }
	]
	public TabData;
	private _activeTab: string;
	constructor(private _dashboardHttpService: DashboardHttpService) { }

	ngOnInit() {
		this.selectTab(this.tabList[0]);
	}
	ngAfterViewInit(){
		console.log('this is test: ', this.audioPlayerTemplate);
	}
	selectTab(selectedTab){
		if(selectedTab.header !== this._activeTab){
			this._activeTab = selectedTab.header;
			this.isLoading = true;
			this._dashboardHttpService
				.getDashboardData(selectedTab.header.toLowerCase())
				.subscribe(
				res => {
					this.TabData = res;
					if (selectedTab.header === 'Collection') {
						this._embededTemplf = this.audioPlayerTemplate;
						this.selectedTracks = res[0].tracks;
					} else {
						this._embededTemplf = null;
					}
				},
				error => console.log('error'),
				() => this.isLoading = false
				)
		}
	}
	switchAlbum(album) {
		this.selectedTracks = album.tracks;
	}

	private _extraCollectionData(res:any){

	}
}
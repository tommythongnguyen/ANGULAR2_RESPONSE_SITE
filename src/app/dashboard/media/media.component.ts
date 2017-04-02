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
		</section>

		<ng-template #collectionTempl let-list="list">
						   <audio-player [tracks]="selectedTracks"></audio-player>
						   <article class="row justify-content-center trackAlbums">
								<card *ngFor="let album of list" [card]="album" class="col-sm-5 col-lg-4" (onSelectCard)="switchAlbum($event)"></card>
						   </article>   
		</ng-template>

		<ng-template #comedyTempl let-list="list">
			<card *ngFor="let item of list" [card]="item" (onSelectCard)="selectClip($event)" class="col-sm-6 col-md-4"></card>
			<overlay [visible]="isShowClip" (onClose)="isShowClip=false" height="500">
				<video-player [list]="clip?clip.source:[]" [playable]="isShowClip" width="600px"></video-player>   
			</overlay>
		</ng-template>
	`
})
export class MediaPageComponent implements OnInit{
	isShowClip: boolean = false;
	clip: any;
	public selectedTracks = [];
	private _embededTemplf: TemplateRef<any>;
	@ViewChild('collectionTempl') collectionTemplate: TemplateRef<any>;
	@ViewChild('comedyTempl') comedyTemplate: TemplateRef<any>;
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
						this._embededTemplf = this.collectionTemplate;
						this.selectedTracks = res[0].tracks;
					} else if(selectedTab.header ==="Comedy") {
						console.log('here');
						this._embededTemplf = this.comedyTemplate;
					}else{
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
	selectClip(clip){
		console.log('clip:', clip);
		this.clip = clip;
		this.isShowClip = true;
	}
	private _extraCollectionData(res:any){

	}
}
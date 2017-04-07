import { Component, OnInit , ViewChild, AfterViewInit, TemplateRef, ChangeDetectionStrategy} from '@angular/core';
import { DashboardHttpService } from '../services';
import { Observable } from 'rxjs/Observable';

@Component({
	selector: 'media-page',
	//changeDetection:ChangeDetectionStrategy.OnPush,
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
			<card *ngFor="let item of list" [card]="item" (onSelectCard)="selectVideo($event)" class="col-sm-6 col-md-4"></card>
			<overlay [visible]="isShowVideo" (onClose)="isShowVideo=false" height="500">
				<video-player [list]="selectedVideo?.source" [playable]="isShowVideo" width="600px"></video-player>   
			</overlay>
		</ng-template>

		<ng-template #otherTempl let-list="list">
			<card *ngFor="let item of list" [card]="item" (onSelectCard)="selectClip($event)" class="col-sm-6 col-md-4"></card>	
			<modal-cmp [visible]="isShowClip" (onCloseModal)="isShowClip=false" height="560">
				<modal-header>
					<p>{{selectedClip?.title}}</p>
				</modal-header>
					
				<modal-body>
					<youtube-player [url]="selectedClip?.src" (onNext)="getNextClip($event)" (onPrev)="getPrevClip($event)"></youtube-player>
				</modal-body>
			</modal-cmp>
		</ng-template>
	`
})
export class MediaPageComponent implements OnInit{
	isShowClip: boolean = false;
	isShowVideo: boolean = false;
	selectedClip: any;
	selectedVideo: any;
	public selectedTracks = [];
	private _embededTemplf: TemplateRef<any>;
	@ViewChild('collectionTempl') collectionTemplate: TemplateRef<any>;
	@ViewChild('comedyTempl') comedyTemplate: TemplateRef<any>;
	@ViewChild('otherTempl') otherTemplate: TemplateRef<any>;
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
						this._embededTemplf = this.otherTemplate;
					}
				},
				error => console.log('error'),
				() => this.isLoading = false
				)
		}
	}
	switchAlbum(album:any) {
		this.selectedTracks = album.tracks;
	}
	selectVideo(video:any) {
		console.log('video:', video);
		this.selectedVideo = video;
		this.isShowVideo = true;
	}
	selectClip(clip:any){
		this.selectedClip = clip;
		this.isShowClip = true;
	}

	getNextClip(currentClipUrl:any){
		for(let i in this.TabData){
			if ((this.TabData[i].src === currentClipUrl)&& (Number(i) < this.TabData.length-1)) {
				this.selectedClip = this.TabData[Number(i) + 1];
				break;
			}
		}
	}
	getPrevClip(currentClipUrl: any) {
		for (let i in this.TabData) {
			if ((this.TabData[i].src === currentClipUrl) && (Number(i) > 0)) {
				this.selectedClip = this.TabData[Number(i) - 1];
				break;
			}
		}
	}
}
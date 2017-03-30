import { Component, OnInit } from '@angular/core';
import { DashboardHttpService, DashboardDataService} from '../services/index';
const albumTitle = {
	family: 'Moments of My Family',
	vegas: 'A Trip To Las Vegas'
};
@Component({
	selector: 'album-page',
	templateUrl: './album.component.html'
})
export class AlbumPageComponent implements OnInit {
	private isLoading: boolean = false;
	private showModal: boolean = false;
	private _albumTitle = albumTitle;
	public selectedThumb;
	public familyAlbum= [];
	public lasVegasAlbum= [];
	public quickViewAblum = [];
	constructor(private _dashboardHttpService: DashboardHttpService,
				private _dashboardDataService: DashboardDataService) { }

	ngOnInit() {
		this.fetchData('family');
		this.fetchData('lasVegas');
	}
	fetchData(url:string):void{
		this.isLoading = true;
		this._dashboardHttpService.getDashboardData(url)
			.subscribe(
			res => {
				console.log('res: ', res)
				if (url === "family") {
					this.familyAlbum = res;
					this._dashboardDataService.setFamilyList(res);
				} else if (url === "lasVegas") {
					this.lasVegasAlbum = res;
					this._dashboardDataService.setVegasList(res);
				}
			},
			err => console.log('error:', err),
			() => this.isLoading = false
			);
	}

	selectThumbnail(selectedThumb, album:string){
		this.selectedThumb = selectedThumb;
		if(album ==='family'){
			this.quickViewAblum = this.familyAlbum;
		}else if (album ==='vegas'){
			this.quickViewAblum = this.lasVegasAlbum;
		}
		this.showModal = true;
	}
}
import { Component, OnInit, Input, Output, OnChanges, SimpleChanges, EventEmitter} from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
	selector: 'youtube-player',
	styleUrls:['./youtube-player.component.scss'],
	template:`
		<section style="height:100%">
			<iframe [src]='_sanitizedUrl' width="100%" height="100%"frameborder="0"
        				webkitallowfullscreen mozallowfullscreen allowfullscreen>
   			</iframe>
   			<div class="play-control">
   				<img src="./assets/graphics/icons/prev.png" alt="prev" class="prev-btn" (click)="prev()">
				<img src="./assets/graphics/icons/next.png" alt="play" class="next-btn" (click)="next()">
			</div>
		</section>
	`
})
export class YoutubePlayerComponent implements OnInit {
	private _isNext: boolean = false;
	private _sanitizedUrl: any;
	@Input() url: string;
	@Output() onNext: EventEmitter<any> = new EventEmitter<any>();
	@Output() onPrev: EventEmitter<any> = new EventEmitter<any>();
	constructor(private _domSanitizer: DomSanitizer) { }

	ngOnInit() {}
	ngOnChanges(changes:SimpleChanges){
		if(changes['url']){
			console.log('url: ', changes['url']);
			this._sanitizedUrl = this._domSanitizer.bypassSecurityTrustResourceUrl(this.url);
		}
	}
	next(){
		this._isNext = true;
		this.onNext.emit(this.url)
	}
	prev(){
		this.onPrev.emit(this.url);
	}
}
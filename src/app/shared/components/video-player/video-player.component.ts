import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef, Input, Output, EventEmitter, OnChanges, SimpleChanges, ViewChild, ElementRef, AfterViewInit, Renderer2} from '@angular/core';
export interface ISource{
	src: string;
}
@Component({
	selector: 'video-player',
	styleUrls:['./video-player.component.scss'],
	changeDetection:ChangeDetectionStrategy.OnPush,
	template:`
		<section class="video-container" [ngStyle]="{width: width? width:'100%', height: height?height:'100%'}">
			<video #player controls="controls" width="100%" height="100%">
			  <source *ngFor="let item of list" src="{{item.src}}" type="video/mp4">
			  Your browser does not support HTML5 video.
			</video>
		</section>	
	`
})
export class VideoPlaylerComponent implements OnInit, OnChanges, AfterViewInit {
	private _playing: boolean = false;
	@Input() width: string;
	@Input() height: string;
	@Input() list: ISource[] = [];
	@Input() playable: boolean = true;
	@Output() onplaying: EventEmitter<ISource[]> = new EventEmitter<ISource[]>();
	@Output() onendPlaying: EventEmitter<ISource[]> = new EventEmitter<ISource[]>();
	@Output() onpausePlaying: EventEmitter<ISource[]> = new EventEmitter<ISource[]>();
	onpauseplaying
	@ViewChild('player') videoPlayer: ElementRef;
	constructor(private _renderer2:Renderer2) {}

	ngOnInit() {}
	ngOnChanges(changes: SimpleChanges) {
		if (changes['playable']) {
			if (this.playable) {
				if (this.videoPlayer && !this._playing){
					this.videoPlayer.nativeElement.load();
					this.play();
				}
				
			}else{
				if (this.videoPlayer && this._playing){
					this.pause();
				}
			}
		}
	}
	
	ngAfterViewInit(){
		this.registerEvents();
		// since the OnChanges['playable'] will not trigger if no @Input() playable
		//this lifecycle hook to make sure everything in this case
		if (this.playable && !this._playing){
			this.play();
		}
	}

	play(){
		this.videoPlayer.nativeElement.play();
	}

	pause(){
		this.videoPlayer.nativeElement.pause();
	}

	registerEvents():void{
		this._renderer2.listen(this.videoPlayer.nativeElement, 'play', this.startPlaying.bind(this));
		this._renderer2.listen(this.videoPlayer.nativeElement, 'pause', this.pausePlaying.bind(this));
		this._renderer2.listen(this.videoPlayer.nativeElement, 'ended', this.endPlaying.bind(this));
	}

	startPlaying(){
		console.log('start');
		this._playing = true;
		this.onplaying.emit(this.list);
	}
	pausePlaying(){
		console.log('pause');
		this._playing = false;
		this.onpausePlaying.emit(this.list);
	}
	endPlaying(){
		console.log('end');
		this._playing = false;
		this.onendPlaying.emit(this.list);
	}

}
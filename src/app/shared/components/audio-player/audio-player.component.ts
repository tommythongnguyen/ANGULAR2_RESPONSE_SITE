import { Component, OnInit, Input, Output, EventEmitter,ChangeDetectionStrategy,OnChanges, ChangeDetectorRef,SimpleChanges, Renderer2, ElementRef, ViewChild, AfterViewInit} from '@angular/core';
export interface ITrack{
	name?: string;
	src?: string;
}

@Component({
	selector: 'audio-player',
	styleUrls:['./audio-player.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
	template:`
		<section class="row justify-content-center audio-player-container">
            <section class="col-sm-10 col-md-8">
                <audio #player controls>
                	<source src="{{activeTrack['src']}}" type="audio/mpeg">
                </audio>
            </section>
           <article class="col-sm-10 col-md-8">
                <ul class="track-group">
                	<li *ngFor="let track of tracks" class="track"(click)="switchTrack(track)" [ngClass]="{'active':track.src === activeTrack.src}">{{track.name}}</li>
                </ul>
            </article>	      
		</section>
	`
})
export class AudioPlayerComponent implements OnInit, OnChanges, AfterViewInit{
	activeTrack:ITrack;
	@Input() tracks: ITrack[];
	@Output() onSelectTrack: EventEmitter<ITrack> = new EventEmitter<ITrack>();
	@ViewChild('player') player: ElementRef;
	constructor(private _renderer2: Renderer2, private _changeDetectorRef: ChangeDetectorRef) { }

	ngOnInit() {}
	ngOnChanges(changes:SimpleChanges){
		let newList = changes['tracks'];
		if(newList && newList.currentValue && newList.currentValue.length){
			this.switchTrack(this.tracks[0]);
		}
	}
	ngAfterViewInit(){
		this.registerEvents();
	}
	switchTrack(track: ITrack) {
		this.activeTrack = track;
		this.player.nativeElement.src = track.src;
		this.onSelectTrack.emit(track);
		this.play();
	}
	play(){
		this.player.nativeElement.play();
	}
	playNext(){
		let currentIndex = this.tracks.findIndex(track => track.src === this.activeTrack.src);
		if (currentIndex < this.tracks.length - 1){
			this.switchTrack(this.tracks[++currentIndex]);
		}
		this._changeDetectorRef.detectChanges(); //kick off changeDetection for this component;
	}
	pause(){
		if(this.player.nativeElement.played){
			this.player.nativeElement.pause();
		}
	}
	registerEvents(){
		this._renderer2.listen(this.player.nativeElement,'ended' ,this.playNext.bind(this))
	}

}
import { Component, OnInit, Input, Output, EventEmitter,ChangeDetectionStrategy, OnChanges, SimpleChanges, ChangeDetectorRef, ElementRef, ViewChild, AfterViewInit} from '@angular/core';
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
                	<li *ngFor="let track of tracks" class="track"(click)="selectTrack(track)">{{track.name}}</li>
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
	constructor(private _changeDetectorRef: ChangeDetectorRef) { }

	ngOnInit() {}
	ngOnChanges(changes:SimpleChanges){
		let newList = changes['tracks'];
		if(newList && newList.currentValue && newList.currentValue.length){
			this.activeTrack = this.tracks[0];
		}
	}
	ngAfterViewInit(){
	}
	selectTrack(track: ITrack) {
		this.activeTrack = track;
		this.player.nativeElement.src = track.src;
		this.onSelectTrack.emit(track);
		this._changeDetectorRef.detectChanges(); //kick off changeDetection for this component;
		this.play();
	}
	play(){
		this.player.nativeElement.play();
	}
	pause(){
		this.player.nativeElement.pause();
	}
}
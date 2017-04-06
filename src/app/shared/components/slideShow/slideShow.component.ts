import { Component, ViewContainerRef, ElementRef, Renderer2, ViewEncapsulation, Input, Output, ChangeDetectionStrategy, OnChanges, SimpleChanges, EventEmitter} from '@angular/core';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { ElementCalculation } from '../../dom';
import { FlexImagesComponent } from '../flexImages';

import { LoadingDirective } from '../loading';
import { OverlayComponent } from '../overlay';
interface IImage{
	url: string;
	alt?: string;
}
@Component({
	selector: 'slide-show',
	exportAs:'slideShow',
	styleUrls: ['./slideShow.component.scss'],
	encapsulation: ViewEncapsulation.Emulated,
	//changeDetection: ChangeDetectionStrategy.OnPush,
    template:`
	<section>
			<overlay [visible]="visible" (onClose)="closeSlideShow()" size="{{size}}" height='{{height}}'>
				<section class="slide-show-header">
					<span class="play-control" (click)="togglePlay()">
						<img src="./assets/graphics/icons/next.png" alt="play" *ngIf="autoplay">
						<img src="./assets/graphics/icons/pause.png" alt="pause" *ngIf="!autoplay">
					</span>
					<span class="close-control"  (click)="closeSlideShow()">
						<img src="./assets/graphics/icons/close.png" alt="close">
					</span>
				</section>
				<section class="slide-show-body">
					<img src="{{slideShowImage?.url}}" alt="{{slideShowImage?.alt}}" width="100%">
				</section>
				<section class="slide-show-footer">
					<ng-container *ngIf="!footer">
						<flex-images 	[list]="imageList" [activeImage]="slideShowImage" (onHover)="autoplay =$event"
										position="center" interval="2000" [autoplay]="autoplay"
										(onSelectImage)="changeSlideShowImage($event)"></flex-images>
					</ng-container>
				</section>
    		</overlay>
    	</section>`	
})

export class SlideShowComponent implements OnChanges {
	private _slideShowImage: IImage;
	private autoplay: boolean = true;
	constructor() {}
	@Output() onBeforeClose: EventEmitter<any> = new EventEmitter<any>();
	@Input() size: string = "md";
	@Input() height: number;
	@Input() imageList: IImage[];
	@Input() visible: boolean = false;
	@Input('displayImage')
	set slideShowImage(image:IImage){
		this._slideShowImage = image;
	}
	get slideShowImage():IImage{
		return this._slideShowImage;
	}
	changeSlideShowImage(newImage:IImage):void{
		this.slideShowImage = newImage;
	}
	closeSlideShow() {
		console.log('close');
		this.autoplay = false;
		this.onBeforeClose.emit({});
	}
	togglePlay(){
		this.autoplay = !this.autoplay;
	}
	ngOnChanges(changes:SimpleChanges){
		if (changes['displayImage']){
			console.log('have input change:', changes['displayImage']);
		}
	}
}
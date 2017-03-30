import { Component, OnInit, Input, ElementRef, TemplateRef, AfterViewChecked, AfterViewInit, OnDestroy, ChangeDetectionStrategy, ChangeDetectorRef, ViewChildren, ViewChild, QueryList, OnChanges, SimpleChanges } from '@angular/core';
import { trigger, state, style,transition, animate} from '@angular/animations';

@Component({
	selector: 'carousel',
	changeDetection: ChangeDetectionStrategy.OnPush,
	styleUrls:[`./carousel.component.scss`],
	template:`
		<div class="carousel">
			<ol class="carousel-indicators">
		        <li *ngFor="let slide of slides; let i = index" [class.active]="i==_activeSlideId" (click)="jumpSlide(i)"></li>
		    </ol>                              
            <ul class="slides" #panelContainer [style.transitionProperty]="'left'" [style.left]="left +'%'" [style.width]="slides?.length * 100 + '%'">
                <li *ngFor="let slide of slides; let i = index" [style.width]="100/slides?.length +'%'">
                    <ng-container *ngTemplateOutlet="slideTemplateRef; context:slide"></ng-container>
                    <ng-container *ngIf="!slideTemplateRef">
						<img class="d-block img-fluid" src="{{slide.src}}" alt="" width="100%" height="auto">
                    </ng-container>
                </li>
            </ul>
	        <a class="carousel-control-prev" role="button" (click)="goPrev()">
	        	<span class="carousel-control-prev-icon" aria-hidden="true"></span>
	            <span class="sr-only">Previous</span>
	        </a>
	        <a class="carousel-control-next" role="button" (click)="goNext()">
	            <span class="carousel-control-next-icon" aria-hidden="true"></span>
	            <span class="sr-only">Next</span>
	        </a>
        </div>  
	`
})
export class CarouselComponent implements AfterViewChecked , OnDestroy, OnChanges{
	private _isStartTimer: boolean = false;
	private left: number = 0;
	private _timerId;
	private _activeSlideId: number = 0;
	private _isCalculatedWidth: boolean = false;
	private _slides: any[] = [];
	@ViewChild('panelContainer') panelContainer:ElementRef;
	@ViewChildren('panel') panels: QueryList<any>;
	@Input('slideTmpl') slideTemplateRef: TemplateRef<any>;
	@Input() set slides(value: any[]) {
		this._slides = value;
	}
	get slides(): any[] {
		return this._slides;
	}

	@Input() autoTiming: number = 3000;

	constructor(private _changeDetectorRef:ChangeDetectorRef) { }
	ngAfterViewChecked():void{
		if (this.slides && this.slides.length && !this._isStartTimer) {
			this._isStartTimer = true;
			this.resetTimer();
			
		}
	}

	ngOnChanges(changes:SimpleChanges){
		let newSet = changes['slides'];
		if(newSet && newSet.currentValue && newSet.currentValue.length){
			this._activeSlideId = 0;
			this.resetTimer();
		}
	}
	ngOnDestroy(){
		this.clearTimer();
	}

	startTimer():void{
		this._timerId = setInterval(()=>{
			this.goNext();
		}, Number(this.autoTiming));
	}

	clearTimer(){
		if (this._timerId) {
			clearInterval(this._timerId);
		}
	}

	resetTimer(){
		this.clearTimer();
		this.startTimer();
	}
	goPrev(){
		this._activeSlideId = this.cycleToPrev(this._activeSlideId);
		this.left = - this._activeSlideId * 100;
		this.triggerChangeDectection();
	}
	goNext(){
		this._activeSlideId = this.cycleToNext(this._activeSlideId);
		this.left = - this._activeSlideId * 100;
		this.triggerChangeDectection();
	}

	cycleToNext(currentId:number):number{
		if (currentId >= this._slides.length-1){
			return 0;
		} 
		return ++currentId;
	}

	cycleToPrev(currentId: number): number {
		if (currentId <=0) {
			return this._slides.length - 1
		}
		return --currentId;
	}
	jumpSlide(nextId:number):void{
		this._activeSlideId = nextId;
		this.left = - this._activeSlideId * 100;
		this.triggerChangeDectection();
	}

	triggerChangeDectection():void{
		this._changeDetectorRef.detectChanges();
	}

}
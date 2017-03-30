import { Component, OnInit,AfterContentInit, OnDestroy,Input, Output, EventEmitter, OnChanges,SimpleChanges, ElementRef, ViewChild, ChangeDetectionStrategy,ChangeDetectorRef, AfterViewChecked, Renderer2} from '@angular/core';
import { ElementCalculation } from '../../dom';
interface IImage{
	url:string;
	alt?:string;
}
type Position = 'left-position' | 'center-position' | 'right-position';
@Component({
	selector: 'flex-images',
	changeDetection: ChangeDetectionStrategy.OnPush,
	styleUrls: ['./flextImages.component.scss'],
	template:`
		<section class="flex-images" [style.width]="width" [ngClass]="position">
			<ul class="scrolling-list" #flexContainer [style.transitionProperty]="'left'" [style.left]="_left +'%'" [style.width]="_srollingWidth + '%'">
				<li #panel *ngFor="let image of list" (click)="selectImage(image)" [ngStyle]="{'width':100/_displayImageNumber + '%'}">
					<img src="{{image.url}}" alt="{{image.alt}}" [ngClass]="{'img-thumbnail rounded':true, 'active-image':image.url === activeImage.url}" />
				</li>
			</ul>
		</section>
	`
})
export class FlexImagesComponent implements OnChanges, AfterContentInit, OnDestroy{
	private _firstChecked: boolean = false;
	private _timerId;
	private _interval: number = 3000;
	private _autoplay: boolean = true;
	private _flexItemMargin: number = 3;
	private _activeImage: IImage; //default
	private _displayImageNumber: number=5;
	private _srollingWidth: number;
	private _left: number;

	private _width: string ="100%";
	private _position: Position = 'center-position';
	@ViewChild('flexContainer') flexContainer: ElementRef;
	@Output() onSelectImage: EventEmitter<IImage> = new EventEmitter<IImage>();
	@Output() onHover: EventEmitter<Boolean> = new EventEmitter<Boolean>();
	@Input()set position(value:string){
		this._position = (value + '-position') as Position;
	}
	get position():string{
		return this._position;
	}
	@Input()set width(value:string){
		if(value.indexOf('%') >0){
			this._width = value;
		}else{
			this._width = parseFloat(value) + 'px';
		}
	}
	get width():string{
		return this._width;
	}
	@Input()list:IImage[]=[];
	@Input()set activeImage(image:IImage){
		this._activeImage = image;
	}
	get activeImage(): IImage {
		return this._activeImage;
	}
	@Input() set displayImageNumber(value:number){
		this._displayImageNumber = Number(value);
	}
	get displayImageNumber():number{
		return this._displayImageNumber;
	}
	@Input()set autoplay(value:boolean){
		this._autoplay = value;
	}
	get autoplay():boolean{
		return this._autoplay;
	}
	@Input() set interval(value:number){
		this._interval = Number(value);
	}
	get interval():number{
		return this._interval;
	}

	constructor(private _renderer2 : Renderer2){}
	ngOnChanges(changes: SimpleChanges){
		if (this.list && this.list.length ) {
			if (changes['list']){
				if (Number(this._displayImageNumber) > this.list.length) {
					this._displayImageNumber = this.list.length;
				}
				this._srollingWidth = 100 * (this.list.length / this._displayImageNumber);
			}
			if (changes['activeImage']){
				this.adjustActiveImagePosition();
				this._firstChecked = true;
				console.log('onChanges');
				this.resetTimer();
			}
			if (changes['autoplay']){
				if (changes['autoplay'].currentValue) {
					this.startTimer();
				}else{
					this.stopTimer();
				}
			}
		}	
	}
	ngAfterContentInit():void{
		this.registerEvents();
		this.startTimer();
	}
	
	ngOnDestroy(){
		this.stopTimer();
	}
	registerEvents():void{
		this._renderer2.listen(this.flexContainer.nativeElement, 'mouseover', ()=>{
			this.onMouseOver(event);
		});
		this._renderer2.listen(this.flexContainer.nativeElement, 'mouseout', ()=>{
			this.onMouseOut(event);
		});
	}

	onMouseOver(event:any):void{
		this.onHover.emit(false);
	}

	onMouseOut(event:any):void{
		this.onHover.emit(true);
	}
	startTimer(){
		if(this.autoplay){
			this._timerId = setInterval(() => {
				this.cycleToNext();
			}, this.interval);
		}
	}
	stopTimer(){
		if (this._timerId){
			clearInterval(this._timerId);
		}
	}
	resetTimer(){
		this.stopTimer();
		this.startTimer();
	}
	cycleToNext():void{
		let nextImage: IImage = this.getNextImage(this.list, this.activeImage);
		this.selectImage(nextImage);
	}
	getNextImage(list:IImage[], item:IImage): IImage {
		let currentIndex = list.indexOf(item);
		return (currentIndex < list.length - 1) ? list[++currentIndex] : list[0];
	}
	selectImage(image:IImage): void {
		this.onSelectImage.emit(image);
		this.activeImage = image;
		this.adjustActiveImagePosition();	
	}

	adjustActiveImagePosition():void{
		if (this.list.length <= this._displayImageNumber) return;
		let index = this.getItemIndex(this.list, this.activeImage);
		if (index < 0) {
			this.activeImage = this.list[0];
			this._left = 0;
			return;
		}
		this._left = -this.calculateLeftSide(this.list, index, this._displayImageNumber); 
	}

	calculateLeftSide(list:IImage[], index:number, displayImageNumber:number){
		let imageWidth = this._srollingWidth / list.length;
		let half = Math.ceil(displayImageNumber / 2);

		if(index < half ){
			return 0;
		}
		if(index >= list.length - half-1){
			return imageWidth* (this.list.length - displayImageNumber);
		}
		return imageWidth * (index - (half-1));

	}
	getItemIndex(list:IImage[], activeImage:IImage):number{
		for(let item of list){
			if (item.url === activeImage.url){
				return list.indexOf(item);
			}
		}
		return -1;
	}
}
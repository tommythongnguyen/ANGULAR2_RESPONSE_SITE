import { Component, OnInit, Input, Output, EventEmitter, ViewChild, Renderer2, ElementRef, OnDestroy, AfterViewInit} from '@angular/core';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { ElementCalculation } from '../../dom';
type OVERLAY_SIZE = 'sm' | 'md' | 'lg';
@Component({
	selector: 'overlay',
	styleUrls:['./overlay.component.scss'],
	template:`
        <div class="overlay-container {{_size}}" #overlay  [style.height.px]="height"
            		[style.display]="visible ? 'block' : 'none'" 
            		[@overlayState]="visible? 'show':'hide'"
            		[loading]="visible" appendTo="body" (onBeforeClose)="closeOverlay()">
                <ng-content></ng-content>
        </div>
	`,
	animations: [
		trigger('overlayState', [
			state('show', style({ opacity: 1 })),
			state('hide', style({ opacity: 0 })),
			transition('show <=> hide', animate('500ms ease-in-out')),
		])
	]
})
export class OverlayComponent implements OnInit, AfterViewInit, OnDestroy{
	private _isFistTime: boolean = true;
	private _size:string = "overlay-md";

	private _lastPageX: number;
	private _lastPageY: number;
	private _dragging: boolean = false;

	private startDragListener: Function;
	private onDragListener: Function;
	private endDragListener: Function;

	@ViewChild("overlay") overlay: ElementRef;
	@Output() onClose: EventEmitter<any> = new EventEmitter<any>();
	@Input() visible: boolean = false;
	@Input() draggable: boolean = true;
	@Input() height: number =545;
	@Input() set size(value: string) {
		if(value === 'lg') {
			this._size = "overlay-lg";
		} else if(value ==='sm') {
			this._size = 'overlay-sm';
		}
	}
	get size(): string {
		return this._size;
	}
	constructor(private _renderer2: Renderer2, public _domCalculation: ElementCalculation) { }

	ngOnInit() {}
	ngAfterViewInit(){
		//use to position the overlay
		if(this._isFistTime){
			this.centerOverlay(this.overlay.nativeElement);
			this.registerEvents();
			this._isFistTime = false;
		}
	}
	
	closeOverlay():void{
		this.onClose.emit({});
	}

	registerEvents(){
		this.startDragListener = this._renderer2.listen(this.overlay.nativeElement, 'mousedown', this.startDrag.bind(this));
		this.onDragListener = this._renderer2.listen(this.overlay.nativeElement, 'mousemove', this.onDrag.bind(this));
		this.endDragListener = this._renderer2.listen(this.overlay.nativeElement, 'mouseup', this.endDrag.bind(this));
	}

	public centerOverlay(element: HTMLElement) {
		let width = this._domCalculation.getOuterWidth(element);
		let height = this._domCalculation.getOuterHeight(element);
		let viewport = this._domCalculation.getViewport();
		let left = (viewport.width - width) / 2;
		let top = (viewport.height - height) / 2;
		this._renderer2.setStyle(element, 'left', left + 'px');
		this._renderer2.setStyle(element, 'top', top + 'px');
	}

	startDrag($event: any): void {
		if (this.draggable && $event.buttons && $event.buttons === 1) {//left button 
			this._dragging = true;
			this._lastPageX = $event.pageX;
			this._lastPageY = $event.pageY;
		}
	}

	onDrag($event): void {
		if (this._dragging) {
			let diffX = $event.pageX - this._lastPageX;
			let diffY = $event.pageY - this._lastPageY;

			let leftPos = parseInt(this.overlay.nativeElement.style.left) + diffX;
			let topPos = parseInt(this.overlay.nativeElement.style.top) + diffY;

			this._renderer2.setStyle(this.overlay.nativeElement, 'left', leftPos + 'px');
			this._renderer2.setStyle(this.overlay.nativeElement, 'top', topPos + 'px');

			this._lastPageX = $event.pageX;
			this._lastPageY = $event.pageY;
		}
	}

	endDrag() {
		this._dragging = false;
	}

	destroyEventListener(listenerFn:Function){
		if (listenerFn) {
			listenerFn();
			listenerFn = null;
		}
	}

	ngOnDestroy(){
		this.destroyEventListener(this.onDragListener);
		this.destroyEventListener(this.onDragListener);
		this.destroyEventListener(this.endDragListener);
	}
}
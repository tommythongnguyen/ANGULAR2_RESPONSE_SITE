import { Component, OnInit, Input, Output, EventEmitter, ViewChild, Renderer2, ElementRef, OnDestroy, AfterViewChecked, OnChanges, SimpleChanges} from '@angular/core';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { ElementCalculation } from '../../dom';
type OVERLAY_SIZE = 'sm' | 'md' | 'lg';
@Component({
	selector: 'overlay',
	styleUrls:['./overlay.component.scss'],
	template:`
        <section class="overlay-container {{size}}" #overlay  [style.height.px]="height"
            		[style.display]="visible ? 'block' : 'none'" 
            		[@overlayState]="visible? 'show':'hide'"
            		[loading]="visible" (onBeforeClose)="closeOverlay()" appendTo="body" spinner="hide">
                <ng-content></ng-content>
        </section>
	`,
	animations: [
		trigger('overlayState', [
			state('show', style({ opacity: 1 })),
			state('hide', style({ opacity: 0 })),
			transition('show <=> hide', animate('500ms ease-in-out')),
		])
	]
})
export class OverlayComponent implements OnInit, OnDestroy, OnChanges, AfterViewChecked {
	public _isFistTime: boolean = true;
	public _needCentering: boolean = false;
	public _size:string = "overlay-md";

	public _lastPageX: number;
	public _lastPageY: number;
	public _dragging: boolean = false;

	public startDragListener: Function;
	public onDragListener: Function;
	public endDragListener: Function;

	@ViewChild("overlay") overlay: ElementRef;
	@Output() onClose: EventEmitter<any> = new EventEmitter<any>();
	@Input() visible: boolean = false;
	@Input() draggable: boolean = true;
	@Input() height: number;
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
	constructor(public _renderer2: Renderer2, public _domCalculation: ElementCalculation) { }

	ngOnInit() {}
	ngOnChanges(changes:SimpleChanges){
		if(changes['visible'] && changes['visible'].currentValue && this._isFistTime){
			this._needCentering = true;
			this._isFistTime = false;
		}
	}
	ngAfterViewChecked(){
		//to make sure the {{size}} that define the width of overlay binding to the template before doing calculation
		if (this._needCentering) {
			this.centerOverlay(this.overlay.nativeElement);
			this.registerEvents();
			this._needCentering = false;
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
		}
	}

	ngOnDestroy(){
		this.destroyEventListener(this.startDragListener);
		this.destroyEventListener(this.onDragListener);
		this.destroyEventListener(this.endDragListener);
	}
}
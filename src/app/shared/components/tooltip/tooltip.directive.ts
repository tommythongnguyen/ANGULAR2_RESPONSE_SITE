import {
	Component, Directive, Input, Output, TemplateRef, OnInit, ElementRef, Renderer2, OnDestroy, ComponentRef, ApplicationRef, Injector, ChangeDetectorRef, NgZone,
	ComponentFactory, ComponentFactoryResolver, ViewContainerRef, ViewChild, EventEmitter, OnChanges, SimpleChanges, ChangeDetectionStrategy} from '@angular/core';

import { ElementCalculation } from '../../dom';
export type TooltipPosition = 'top' | 'right' | 'bottom' | 'left';

@Directive({
	selector: '[tooltip]',
})
export class TooltipDirective implements OnDestroy, OnInit, OnChanges {
	private _tooltipState: string = "hide";
	private _tooltipCmpRef: ComponentRef<TooltipComponent>
	private _mouseoverListener: Function;
	private _mouseoutListener: Function;
	private _clickListener: Function;
	@Output() ontoggleTooltip: EventEmitter<Object> = new EventEmitter<Object>();
	@Input() trigger: string = "hover";//click
	@Input() tooltip: string | TemplateRef<Object>;
	@Input() tooltipContext: any;
	@Input() placement: TooltipPosition = 'top';//'leff' | 'right' | 'top' | 'bottom'
	@Input() appendTo: string = "body";
	@Input() dismiss: boolean = false; //allow to show/hide tooltip for outside of tooltip
	constructor(
		private _elementRef: ElementRef, 
		private _viewContainerRef: ViewContainerRef,
		private _renderer2:Renderer2,
		private _componentFactoryResolver: ComponentFactoryResolver,
		private _dom: ElementCalculation,
		protected applicationRef: ApplicationRef,
		protected injector:Injector,
		protected zone: NgZone) { }
	ngOnInit(){
		this.registerEvents();
	}
	ngOnChanges(changes:SimpleChanges){
		if (changes['dismiss'] && !!this.dismiss && this._tooltipCmpRef && this.trigger === "click") {
			if (this._tooltipState === "show") {
				this.hideTooltip();
			}
		}
		if(changes['tooltip'] && changes['tooltip'].currentValue && this._tooltipCmpRef){
			console.log('tooltipContent');
			this._tooltipCmpRef.instance.tooltipContent = this.tooltip;
			this._triggerTooltipChangeDetection();
		}
		if (changes['tooltipContext'] && changes['tooltipContext'].currentValue && this._tooltipCmpRef) {
			console.log('tooltipContextttttt');
			this._tooltipCmpRef.instance.tooltipContext = this.tooltipContext;

			this._triggerTooltipChangeDetection();
		}
	}
	
	
	registerEvents(){
		if (this.trigger==="click"){
			this._clickListener = this._renderer2.listen(this._elementRef.nativeElement, 'click', this.toggleTooltip.bind(this));
		}else{
			this._mouseoverListener = this._renderer2.listen(this._elementRef.nativeElement, 'mouseover', this.showTooltip.bind(this));
			this._mouseoutListener = this._renderer2.listen(this._elementRef.nativeElement, 'mouseout', this.hideTooltip.bind(this));
		}
	}

	buildTooltip(){
		if(this._tooltipCmpRef){
			this._tooltipCmpRef.destroy();
		}

		let tooltipCmpFactory = this._componentFactoryResolver.resolveComponentFactory(TooltipComponent);
		if(this.appendTo==="body"){
			this._tooltipCmpRef = tooltipCmpFactory.create(this.injector);

			let rootComponentRef = this.applicationRef.components[0];
			let rootComponentNode = rootComponentRef.location.nativeElement;
			//attached this tooltip dom node to the rootnode
			this._renderer2.appendChild(rootComponentNode, this._tooltipCmpRef.location.nativeElement);

			//add this tooltip viewRef to the ApplicationRef: so Angular itself will take care update the view biding for us
			this.applicationRef.attachView(this._tooltipCmpRef.hostView);

		}else{
			//append to the target
			this._tooltipCmpRef = this._viewContainerRef.createComponent(tooltipCmpFactory);
		}

		//append tooltip content
		if (this.tooltipContext) {
			this._tooltipCmpRef.instance.tooltipContext = this.tooltipContext;
		}
		this._tooltipCmpRef.instance.tooltipContent = this.tooltip;
		this._tooltipCmpRef.instance.placement = this.placement;
		this._triggerTooltipChangeDetection();
	}

	_triggerTooltipChangeDetection(){
		//mark the tooltip component for check to update the view 
		this._tooltipCmpRef.instance._markForCheck();

		//run the zone here to mark sure the view has been update then do the tooltipPosition caculation
		setTimeout(()=>{
			this.zone.onMicrotaskEmpty.first().subscribe(() => {
				console.log('onMicrotaskEmpty');
				this.calcTooltipPosition();
			});
		})
		
	}

	calcTooltipPosition() {
		let tooltipContainer:HTMLElement = this._tooltipCmpRef.instance.tooltipContainer.nativeElement;
		let offset = (this.appendTo !== 'body') ? { left: 0, top: 0 } : this._dom.getOffset(this._elementRef.nativeElement);
		let targetTop = offset.top;
		let targetLeft = offset.left;
		let left: number;
		let top: number;
		switch (this.placement) {
			case 'right':
				left = targetLeft + this._dom.getOuterWidth(this._elementRef.nativeElement);
				top = targetTop + (this._dom.getOuterHeight(this._elementRef.nativeElement) - this._dom.getOuterHeight(tooltipContainer)) / 2;
				break;

			case 'left':
				left = targetLeft - this._dom.getOuterWidth(tooltipContainer);
				top = targetTop + (this._dom.getOuterHeight(this._elementRef.nativeElement) - this._dom.getOuterHeight(tooltipContainer)) / 2;
				break;

			case 'top':
				left = targetLeft + (this._dom.getOuterWidth(this._elementRef.nativeElement) - this._dom.getOuterWidth(tooltipContainer)) / 2;
				top = targetTop - this._dom.getOuterHeight(tooltipContainer);
				break;

			case 'bottom':
				left = targetLeft + (this._dom.getOuterWidth(this._elementRef.nativeElement) - this._dom.getOuterWidth(tooltipContainer)) / 2;
				top = targetTop + this._dom.getOuterHeight(this._elementRef.nativeElement);
				break;
		}
		this._renderer2.setStyle(tooltipContainer, 'top', top + 'px');
		this._renderer2.setStyle(tooltipContainer, 'left', left + 'px');
	}

	showTooltip(){
		if(!this._tooltipCmpRef){
			this.buildTooltip();
		}
		this._tooltipCmpRef.instance.show();
		this._tooltipState = "show";
		this.ontoggleTooltip.emit({ show: true });
	}
	hideTooltip(){
		if(this._tooltipCmpRef){
			this._tooltipCmpRef.instance.hide();
			this._tooltipState = "hide";
			this.ontoggleTooltip.emit({ show: false });
		}
		
	}

	toggleTooltip(){
		if (this._tooltipState === "show") {
			this.hideTooltip();
		}else{
			this.showTooltip();
		}
	}
	ngOnDestroy(){
		this._mouseoutListener = null;
		this._mouseoverListener = null;
		this._clickListener = null;
		if(this._tooltipCmpRef){
			this._tooltipCmpRef.destroy();
			this._tooltipCmpRef = null;
		}
	}
}

@Component({
	selector:'tooltip',
	//changeDetection:ChangeDetectionStrategy.OnPush,
	styleUrls:['./tooltip.component.scss'],
	template:`
		<div #tooltipContainer class="tooltip-container tooltip-container-{{placement}}" role="tooltip" >
		  <div class="tooltip-arrow"></div>
		  <div class="tooltip-content">
		    <ng-container *ngIf="!_templateRefContent">
				<div [innerHTML]="tooltipContent"></div>
		    </ng-container>
		    <ng-container *ngIf="_templateRefContent" [templateFactory]="tooltipContent" [context]="tooltipContext"></ng-container>
		  </div>
		</div>
	`
})
export class TooltipComponent{
	private _stringContent: string;
	private _templateRefContent: TemplateRef<any>;
	constructor(private _renderer2: Renderer2, private _elementRef: ElementRef, protected changeDetectionRef: ChangeDetectorRef) { }
	@Input() placement: TooltipPosition;
	@ViewChild('tooltipContainer') tooltipContainer: ElementRef;
	@Input() tooltipContext;
	@Input() set tooltipContent(content: string | TemplateRef<any>){
		if(typeof content ==="string"){
			this._stringContent = content;
		}
		else if (typeof content ==="object"){//must be templateRef
			this._templateRefContent = content;
		}
	}
	get tooltipContent(): string | TemplateRef<any>{
		return this._templateRefContent || this._stringContent;
	}
	show(){
		this._renderer2.setStyle(this.tooltipContainer.nativeElement, 'opacity', 1);
	}
	hide(){
		this._renderer2.setStyle(this.tooltipContainer.nativeElement, 'opacity', 0);
	}

	_markForCheck():void{
		this.changeDetectionRef.markForCheck();
	}
	
}

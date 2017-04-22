// import {
// 	Component, Directive, Input, Output, TemplateRef, AfterViewInit, ElementRef, Renderer2, OnDestroy, ComponentRef, AfterViewChecked,
// 	ComponentFactory, ComponentFactoryResolver, ViewContainerRef, ViewChild, EventEmitter, OnChanges, SimpleChanges, ChangeDetectionStrategy} from '@angular/core';

// import { ElementCalculation } from '../../../shared/dom';
// @Directive({
// 	selector: '[tooltip]',
// })

// export class TooltipDirective implements OnDestroy, AfterViewInit, AfterViewChecked, OnChanges {
// 	private _firstCheck: boolean = true;
// 	private _tooltipState: string = "hide";
// 	private _tooltipCmpRef: ComponentRef<TooltipComponent>
// 	private _mouseoverListener: Function;
// 	private _mouseoutListener: Function;
// 	private _clickListener: Function;
// 	@Output() onhoverTooltip: EventEmitter<any> = new EventEmitter<any>();
// 	@Output() onclickTooltip: EventEmitter<any> = new EventEmitter<any>();
// 	@Input() trigger: string = "hover";//click
// 	@Input() tooltip: string | TemplateRef<Object>;
// 	@Input() tooltipContext: any;
// 	@Input() placement: string = 'top';//'leff' | 'right' | 'top' | 'bottom'
// 	@Input() show: boolean = false; //allow to show/hide tooltip for outside of tooltip
// 	constructor(
// 		private _elementRef: ElementRef, 
// 		private _viewContainerRef: ViewContainerRef,
// 		private _renderer:Renderer2,
// 		private _componentFactoryResolver: ComponentFactoryResolver,
// 		private _dom: ElementCalculation) { }
// 	ngOnChanges(changes:SimpleChanges){
// 		if (changes['show'] && this._tooltipCmpRef) {
// 			if(this.show && this._tooltipState==="hide"){
// 				this.showTooltip();
// 			}
// 			if(!this.show && this._tooltipState ==="show"){
// 				this.hideTooltip();
// 			}
// 		}
// 		if (changes['tooltipContext'] && (typeof this.tooltip !== 'string') && this._tooltipCmpRef){
// 			this._tooltipCmpRef.instance.context = this.tooltipContext;
// 		}
// 	}
// 	ngAfterViewInit(){
// 		if (!this._tooltipCmpRef) {
// 			//create tooltipComponent
// 			let componentFactory = this._componentFactoryResolver.resolveComponentFactory(TooltipComponent);
// 			this._tooltipCmpRef =this._viewContainerRef.createComponent(componentFactory);
// 			//console.log('this._tooltipCmpRef.location.nativeElement: ', this._tooltipCmpRef.location.nativeElement)
// 			this._tooltipCmpRef.instance.content = this.tooltip;
// 			this._tooltipCmpRef.instance.context = this.tooltipContext;
// 		}
// 		this.registerEvents();
// 	}
// 	ngAfterViewChecked(){
// 		if (this._firstCheck) {
// 			let top: number;
// 			let left: number;
// 			let offsetElement = this._dom.getOffset(this._elementRef.nativeElement);
// 			let offsetLeft = offsetElement.left;
// 			let offsetTop = offsetElement.top;
// 			let tooltipElement: HTMLElement = this._tooltipCmpRef.instance.tooltipContainer.nativeElement;
// 			switch (this.placement) {
// 				case 'top':
// 					top = offsetTop -this._dom.getOuterHeight(tooltipElement);
// 					left = offsetLeft + (this._dom.getOuterWidth(this._elementRef.nativeElement) - this._dom.getOuterWidth(tooltipElement)) / 2;
// 					break;

// 				default:
// 					// code...
// 					break;
// 			}
// 			console.log('offsetElement:', offsetElement);
// 			this._renderer.setStyle(tooltipElement, 'top', -(this._dom.getOuterHeight(tooltipElement)+ this._dom.getOuterHeight(tooltipElement)) + 'px');
// 			this._renderer.setStyle(tooltipElement, 'left', left + 'px');
// 			this._firstCheck = false;

// 		}

// 	}
	
// 	registerEvents(){
// 		if (this.trigger==="click"){
// 			this._clickListener = this._renderer.listen(this._elementRef.nativeElement, 'click', this.toggleTooltip.bind(this));
// 		}else{
// 			this._mouseoverListener = this._renderer.listen(this._elementRef.nativeElement, 'mouseover', this.showTooltip.bind(this));
// 			this._mouseoutListener = this._renderer.listen(this._elementRef.nativeElement, 'mouseout', this.hideTooltip.bind(this));
// 		}
// 	}

// 	showTooltip(){
// 		if(this._tooltipCmpRef){
// 			this._tooltipCmpRef.instance.show();
// 			if(this.trigger ==="click"){
// 				this.onclickTooltip.emit('show');
// 				this._renderer.setStyle(this._tooltipCmpRef.instance.tooltipContainer.nativeElement, 'width',200+'px');
// 			this._renderer.appendChild(this._elementRef.nativeElement, this._tooltipCmpRef.location.nativeElement);
				
// 			}else{
// 				this.onhoverTooltip.emit('show');
// 			}
// 			this._tooltipState = "show";
// 		}
// 	}
// 	hideTooltip(){
// 		if(this._tooltipCmpRef){
// 			this._tooltipCmpRef.instance.hide();
// 			if (this.trigger === "click") {
// 				this.onclickTooltip.emit('hide');
// 			} else {
// 				this.onhoverTooltip.emit('hide');
// 			}
// 		}
// 		this._tooltipState = "hide";
// 	}

// 	toggleTooltip(){
// 		if (this._tooltipCmpRef) {
// 			if (this._tooltipState === "show") {
// 				this.hideTooltip();
// 			}else{
// 				this.showTooltip();
// 			}
// 		}
		
// 	}
// 	ngOnDestroy(){
// 		this._mouseoutListener = null;
// 		this._mouseoverListener = null;
// 		this._clickListener = null;
// 		if(this._tooltipCmpRef){
// 			this._tooltipCmpRef.destroy();
// 		}
// 	}
// }

// @Component({
// 	selector:'tooltip',
// 	//changeDetection:ChangeDetectionStrategy.OnPush,
// 	styleUrls:['./tooltip.component.scss'],
// 	template:`
// 		<div #tooltipContainer class="tooltip tooltip-top" role="tooltip">
// 		  <div class="tooltip-arrow"></div>
// 		  <div class="tooltip-inner">
// 		    <ng-container *ngIf="!_templateRefContent">{{content}}</ng-container>
// 		    <ng-container *ngIf="_templateRefContent" [templateFactory]="content" [context]="context"></ng-container>
// 		  </div>
// 		</div>
// 	`
// })
// export class TooltipComponent implements OnChanges{
// 	private _stringContent: string;
// 	private _templateRefContent: TemplateRef<any>;
// 	constructor(private _renderer: Renderer2, private _elementRef: ElementRef) { }
// 	@ViewChild('tooltipContainer') tooltipContainer: ElementRef;
// 	@Input() context;
// 	@Input() set content(content: string | TemplateRef<any>){
// 		if(typeof content ==="string"){
// 			this._stringContent = content;
// 		}
// 		else if (typeof content ==="object"){//must be templateRef
// 			this._templateRefContent = content;
// 		}
// 	}
// 	get content(): string | TemplateRef<any>{
// 		return this._templateRefContent || this._stringContent;
// 	}
// 	ngOnChanges(changes:SimpleChanges){
// 		if(changes['content'] ){
// 			console.log('context: ', this.context);
// 		}
// 	}
// 	show(){
// 		this._renderer.setStyle(this.tooltipContainer.nativeElement, 'opacity', 1);
// 	}
// 	hide(){
// 		this._renderer.setStyle(this.tooltipContainer.nativeElement, 'opacity', 0);
// 	}
	
// }

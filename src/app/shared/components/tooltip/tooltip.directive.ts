import { Directive, OnInit, OnDestroy, Renderer2, Input, Output, EventEmitter, ViewContainerRef, TemplateRef,
 	ElementRef,AfterViewInit, ViewRef, OnChanges, SimpleChanges} from '@angular/core';
import { ElementCalculation } from '../../dom';
@Directive({
	selector: '[tooltip]'
})
export class TooltipDirective implements OnInit, AfterViewInit, OnDestroy, OnChanges{
	private _shown:boolean =false;
	private _tooltipContainer: HTMLDivElement;
	private _tooltipArrow: HTMLDivElement;
	private _tooltipInner: HTMLDivElement;

	@Input() trigger: string = "hover";
	@Input()tooltip:string |TemplateRef<Object>="";
	@Input() tooltipContext: any;
	@Input() tooltipId: string;
	@Input()appendTo:any="body";//'target'
	@Input() placement: string = "right";
	@Input() visible: boolean = false;
	@Output() ontoggleTooltip: EventEmitter<Object> = new EventEmitter<Object>();
	constructor(
		private _renderer2:Renderer2, 
		private _viewContainerRef: ViewContainerRef,
		private _elementRef:ElementRef,
		private _dom: ElementCalculation) { }
	ngOnChanges(changes:SimpleChanges){
		if (changes['visible'] && this._tooltipContainer){
			if(this.visible && !this._shown){
				this.showTooltip();
			}else if (!this.visible && this._shown){
				this.hideTooltip();
			}
		}
	}
	ngOnInit(){
		this.createTooltip();
	}
	ngAfterViewInit(){
		//register click event
		this.registerEvents();
	}
	createTooltip(){
		if (this._tooltipContainer){
			return;
		}
		let styleClass = "tooltip-container tooltip-container-" + this.placement;

		this._tooltipContainer = this._renderer2.createElement('div');
		this.addClassesToElement(this._tooltipContainer, styleClass);

		this._tooltipArrow = this._renderer2.createElement('div');
		this.addClassesToElement(this._tooltipArrow, 'tooltip-arrow');

		this._tooltipInner = this._renderer2.createElement('div');
		this.addClassesToElement(this._tooltipInner, 'tooltip-content');
		
		//append Child
		this._renderer2.appendChild(this._tooltipContainer, this._tooltipArrow);
		this._renderer2.appendChild(this._tooltipContainer, this._tooltipInner);
	}

	addClassesToElement(el:HTMLElement, cls:string){
		let classes = cls.split(' ');
		classes.map(elClass => {
			this._renderer2.addClass(el, elClass);
		});
	}
	registerEvents(){
		if(this.trigger ==="click"){
			this._renderer2.listen(this._elementRef.nativeElement, 'click', this.click.bind(this));
		}else{
			this._renderer2.listen(this._elementRef.nativeElement,'mouseover',this.mouseOver.bind(this));
			this._renderer2.listen(this._elementRef.nativeElement,'mouseout', this.mouseOut.bind(this));
		}
	}
	click($event){
		$event.stopPropagation();
		if(!this._shown){
			//this._renderer2.setStyle(this._tooltipContainer, 'opacity',1);
			this.showTooltip();
		}else{
			//this._renderer2.setStyle(this._tooltipContainer, 'opacity',0);
			this.hideTooltip();
		}
	}

	mouseOver(){
		//this._renderer2.setStyle(this._tooltipContainer, 'opacity',1);
		this._shown = true;
		this.showTooltip();
	}

	mouseOut(){
		//this._renderer2.setStyle(this._tooltipContainer, 'opacity',0);
		this._shown = false;
		this.hideTooltip();
	}

	showTooltip(){
		this.buildTooltipContent();
		this.appendTooltip();
		this.calcTooltipPosition();
		//show tooltip-----
		this._renderer2.setStyle(this._tooltipContainer, 'opacity', 1);
		this.ontoggleTooltip.emit({ show: true });
		this._shown = true;
	}
	hideTooltip(){
		this._tooltipInner.innerHTML = "";
		this._renderer2.setStyle(this._tooltipContainer, 'opacity', 0);
		this.ontoggleTooltip.emit({ show: false });
		this._shown = false;
	}

	buildTooltipContent(){
		if (typeof this.tooltip === "string") {
			let ttLength = this.tooltip.length;
			let tooltipString = this.tooltip.trim();
			if (tooltipString.charAt(0) === "<" && tooltipString.charAt(ttLength - 1) === ">") {
				//this is string of dom
				this._tooltipInner.insertAdjacentHTML("afterbegin", tooltipString);
			} else {
				this._tooltipInner.innerHTML = this.tooltip;
			}
		} else if (typeof this.tooltip === "object" && this.tooltipId) {//have to be TemplateRef
			//let create the child view inside this viewContainer
			let embbedView: ViewRef = this._viewContainerRef.createEmbeddedView(this.tooltip, this.tooltipContext);
			let templateElement = document.getElementById(this.tooltipId);

			this._renderer2.appendChild(this._tooltipInner, templateElement);
		}
	}

	appendTooltip(){
		if (this.appendTo === "body") {
			this._renderer2.appendChild(document.body, this._tooltipContainer);
		} else if (this.appendTo = "target") {
			this._renderer2.appendChild(this._elementRef.nativeElement, this._tooltipContainer);
		}
	}

	calcTooltipPosition(){
		let offset = (this.appendTo !== 'body') ? { left: 0, top: 0 } : this._dom.getOffset(this._elementRef.nativeElement);
		let targetTop = offset.top;
		let targetLeft = offset.left;
		let left: number;
		let top: number;
		switch (this.placement) {
			case 'right':
				left = targetLeft + this._dom.getOuterWidth(this._elementRef.nativeElement);
				top = targetTop + (this._dom.getOuterHeight(this._elementRef.nativeElement) - this._dom.getOuterHeight(this._tooltipContainer)) / 2;
				break;

			case 'left':
				left = targetLeft - this._dom.getOuterWidth(this._tooltipContainer);
				top = targetTop + (this._dom.getOuterHeight(this._elementRef.nativeElement) - this._dom.getOuterHeight(this._tooltipContainer)) / 2;
				break;

			case 'top':
				left = targetLeft + (this._dom.getOuterWidth(this._elementRef.nativeElement) - this._dom.getOuterWidth(this._tooltipContainer)) / 2;
				top = targetTop - this._dom.getOuterHeight(this._tooltipContainer);
				break;

			case 'bottom':
				left = targetLeft + (this._dom.getOuterWidth(this._elementRef.nativeElement) - this._dom.getOuterWidth(this._tooltipContainer)) / 2;
				top = targetTop + this._dom.getOuterHeight(this._elementRef.nativeElement);
				break;
		}
		this._renderer2.setStyle(this._tooltipContainer, 'top', top + 'px');
		this._renderer2.setStyle(this._tooltipContainer, 'left', left + 'px');
	}

	ngOnDestroy(){
		this.hideTooltip();
		this._tooltipInner = null;
	}

}
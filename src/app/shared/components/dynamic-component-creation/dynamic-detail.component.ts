import { Component, OnInit, ViewChild, ViewContainerRef, ComponentRef, ComponentFactory, AfterViewInit, OnChanges, SimpleChanges, OnDestroy, Input} from '@angular/core';
import { IDynamicData, DynamicComponentBuilderService } from './component-builder.service';
import { TemplateBuilderService } from './template-builder.service';
interface IEntity{
	code?: string;
	description?: string;
}
@Component({
	selector: 'dynamic-detail',
	template:`
		<div>
			Check/Uncheck to use INPUT vs TEXTAREA:
			<input type="checkbox" #val (click)="refreshContent(val.checked)" /><hr />
			<div #dynamicContainPlaceHolder></div><hr />
			entity: <pre>{{entity|json}}</pre>
		</div>
	`
})
export class DynamicDetailComponent implements OnInit, AfterViewInit, OnChanges, OnDestroy {
	@ViewChild('dynamicContainPlaceHolder', { read: ViewContainerRef })
	protected dynamicViewContainer: ViewContainerRef;
	protected componentRef: ComponentRef<IDynamicData>;
	protected wasViewInitialized: boolean = false;
	@Input() entity: IEntity;
	constructor(private _templateBulderSerive: TemplateBuilderService,
		private _componentBuilderService: DynamicComponentBuilderService) { }

	ngOnInit() {}
	refreshContent(useTextarea:boolean= false){
		if(this.componentRef){
			this.componentRef.destroy();
		}
		//letl build the template for the component base on the entity information
		let template:string = this._templateBulderSerive.buildTemplate(this.entity, useTextarea);

		// let build the componentFactory from this template 
		this._componentBuilderService.createComponentFactory(template)
										.then((cmpFactory:ComponentFactory<IDynamicData>)=>{
											//create the component and inject it to the dynamicViewPlaceHolder
											this.componentRef = this.dynamicViewContainer.createComponent(cmpFactory);
											//update the component input
											this.componentRef.instance.entity = this.entity;
										})
	}
	//using this lifecycle to make sure that we got the component build by defore
	ngAfterViewInit(){
		this.refreshContent();
		this.wasViewInitialized = true;
	}

	ngOnChanges(changes:SimpleChanges){
		if(changes['entity'] && (typeof changes['entity'].currentValue ==="object") && this.wasViewInitialized){
			this.refreshContent();
		}
	}
	ngOnDestroy(){
		if(this.componentRef){
			this.componentRef.destroy();
			this.componentRef = null;
		}
	}

}
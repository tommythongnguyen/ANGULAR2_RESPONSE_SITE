import { Directive, OnChanges, SimpleChanges, OnDestroy, ViewContainerRef, Input, Output, TemplateRef, EmbeddedViewRef} from '@angular/core';

@Directive({
	selector: '[templateFactory]'
})
export class TemplateFactoryDirective implements OnChanges, OnDestroy {
	private _viewRef: EmbeddedViewRef<any>;
	@Input() templateFactory: TemplateRef<any>;
	@Input() context: any;
	constructor(private _viewContainerRef: ViewContainerRef) {}

	ngOnChanges(changes:SimpleChanges) {
		if ((changes['templateFactory'] && changes['templateFactory'].currentValue )||
			(changes['context'] && changes['context'].currentValue)){
			console.log('changes: ', changes);
			if (this._viewRef){
				//destroy this view
				this._viewContainerRef.remove(this._viewContainerRef.indexOf(this._viewRef));
			}
			//let create this view 
			this._viewRef = this._viewContainerRef.createEmbeddedView(this.templateFactory, this.context);
		}
	}
	ngOnDestroy() {
		if(this._viewRef){
			this._viewRef.destroy();
		}
	}
}
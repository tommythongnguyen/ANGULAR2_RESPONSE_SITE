import {NgModule} from '@angular/core';
import {PartsModule} from './parts'
import { DynamicDetailComponent } from './dynamic-detail.component';
import {DynamicComponentBuilderService} from './component-builder.service';
import {TemplateBuilderService} from './template-builder.service';

@NgModule({
	declarations: [DynamicDetailComponent],
	imports: [PartsModule],
	exports: [DynamicDetailComponent]
})
export class DynamicCreationModule{
	static forRoot(){
		return {
			ngModule: DynamicCreationModule,
			providers: [DynamicComponentBuilderService, TemplateBuilderService]
		};
	}
}

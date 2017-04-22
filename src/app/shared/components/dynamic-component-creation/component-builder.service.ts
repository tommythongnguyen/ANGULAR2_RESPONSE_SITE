import { Injectable, ComponentFactory, Component, NgModule, Input, Compiler} from '@angular/core';
import {JitCompiler} from '@angular/compiler';
import { PartsModule } from './parts';
export interface IDynamicData {
	entity: any;
}

@Injectable()
export class DynamicComponentBuilderService{
	constructor(private _jitCompiler: Compiler) { }

	private _cacheOfFactories:{ [templateKey:string]:ComponentFactory<IDynamicData>}= {};
	createComponentFactory(template:string): Promise<ComponentFactory<IDynamicData>>{
		let factory = this._cacheOfFactories[template];
		if(factory){
			return new Promise(resolve=>{
				return resolve(factory);
			})
		}

		//unknow template ...let's create the component and module for it
		let componentType = this.createNewComponent(template);
		let module = this.createNewModule(componentType);

		return new Promise(resolve=>{
			this._jitCompiler
				.compileModuleAndAllComponentsAsync(module)
				.then(moduleWithFactories => {
					let componentFactories = moduleWithFactories.componentFactories;
					console.log('componentFactories: ', componentFactories);
					for (let cmpFactory of componentFactories) {
						//console.log('componentFactories: ', cmpFactory);
						if (cmpFactory.componentType === componentType) {
							return resolve(cmpFactory);
						}
					}
				});
		})
	}

	protected createNewComponent(template:string){
		@Component({
			selector:'dynamic-component',
			template: template
		})
		class RuntimeDynamicComponent implements IDynamicData{
			@Input() entity: any;
		}
		return RuntimeDynamicComponent;
	}

	protected createNewModule(componentType:any){
		@NgModule({
			declarations: [componentType],
			imports: [PartsModule]
		})
		//a new module just for this ComponentType
		class RuntimeComponentModule{}
		return RuntimeComponentModule;
	}
}
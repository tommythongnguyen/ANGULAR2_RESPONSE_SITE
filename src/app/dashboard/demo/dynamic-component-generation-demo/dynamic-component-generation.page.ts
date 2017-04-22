import { Component } from '@angular/core';

@Component({
	selector: 'dynamic-component-generation-demo',
	template: `
		<div>
		   <h2>An app with DYNAMIC content</h2>
		   <hr />
		   <dynamic-detail [entity]="test"></dynamic-detail>
		</div>
	`
})
export class DynamicComponentGenerationDemoPage{
	private test = {
		model:'today is saturday',
		myid:'tommy',
		code: "123ACB",
		description: 'whatever you want'
	};
	
}
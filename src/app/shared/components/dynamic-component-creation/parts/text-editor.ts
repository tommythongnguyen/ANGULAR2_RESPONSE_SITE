import { Component, Input } from '@angular/core';

@Component({
	selector: 'text-editor',
	template:`
		<section>
			<div>{{propName}}</div>
			<textarea type="text" cols="15" rows="15" [(ngModel)]="entity[propName]"></textarea>
		</section>
	`
})
export class TextEditor{
	@Input() propName: string;
	@Input() entity: any;
}
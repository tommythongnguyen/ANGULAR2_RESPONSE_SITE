import { Component, OnInit, Input} from '@angular/core';

@Component({
	selector: 'string-editor',
	template:`
		<section>
			<div>{{propName}}</div>
			<input type="text" [(ngModel)]="entity[propName]" />
		</section>
	`
})
export class StringEditor{
	@Input() propName: string;
	@Input() entity: any;
}
import { Component, OnInit } from '@angular/core';

@Component({
	selector: 'accordion-demo',
	template:`
		<accordion [activeTabNumber]="myActive">
			<accordion-tab title="{{data[0].title}}">
				<h5>My Tab Content: {{data[0].content}}</h5>
			</accordion-tab>
			<accordion-tab title="{{data[1].title}}">
				<h5>My Tab Content: {{data[1].content}}</h5>
			</accordion-tab>
			<accordion-tab [title]="tmpl" [titleContext]="data[0]">
				<h5>My Tab Content: {{data[3].content}}</h5>
			</accordion-tab>
			<accordion-tab title="{{data[2].title}}">
				<h5>My Tab Content: {{data[2].content}}</h5>
			</accordion-tab>
		</accordion>

		<ng-template #tmpl let-title="title">
			<span>Hello Tommy {{title}}</span>
			<i class="fa fa-id-card-o" aria-hidden="true"></i>
		</ng-template>
	`	
})
export class AccordionDEMO implements OnInit {
	public data= [];
	private myActive: number = 2;
	constructor() {}

	ngOnInit() {
		this.data = [
			{title:'Title1', content:'whatever you want 1'},
			{ title: 'Title2', content: 'whatever you want 2' },
			{ title: 'Title3', content: 'whatever you want 3' },
			{ title: 'Title4', content: 'whatever you want 4' }

		];
	}
}
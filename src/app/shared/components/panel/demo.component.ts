import { Component, OnInit } from '@angular/core';

@Component({
	selector: 'panel-demo',
	template:`
		<panel [dismissable]="true" [showPanel]="showPanel" [toggleable]="true"
			   title="Tommy Thong Nguyen"	(onInternalDismissedPanel)="showPanel =false"></panel>
		<panel [contentTemplate]="" [toggleable]="true"></panel>
		<panel [contentTemplate]="tmpl"></panel>

		<ng-template #tmpl>
			<div style="margin-top:10px; margin-bottom:10px">
				Hello {{fullName}}
			</div>
		</ng-template>

		<button (click)="showPanel = !showPanel">Toggle Panel</button>
	`
})
export class PanelDemoComponent implements OnInit {
	public myName: string = "Tommy Nguyen";
	public showPanel: boolean = true;
	constructor() {}

	ngOnInit() {
		
	}
}
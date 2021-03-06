import { Component, OnInit } from '@angular/core';

@Component({
	selector: 'tooltip-demo',
	styles: [`
		.myTempl{
			color:blue;
		}
		.my-btn:hover{
				cursor:pointer;
		}
	`],
	template: `
		<div style="position:relative">
			<button class="btn btn-primary" trigger="click" tooltip="<h5>inner Tooltip {{myName.name}}</h5>"  placement="bottom" appendTo="target" >
				Tooltip  With Text and HTML
			</button>
		</div><hr />

		<button class="btn btn-primary" [tooltip]="tooltipTempl" placement="bottom" [dismiss]="dismissable"
				[tooltipContext]="myName" trigger="click" (ontoggleTooltip)="toggle($event)"
			>Tooltip with Template
		</button>

		<ng-template #tooltipTempl let-name="name">
			<section id="tmplId">
				<div  class="myTempl">Hello World: {{name}}</div>
				<div>
					<button class="btn btn-primary my-btn" (click)="close($event)">Close</button>
				</div>
			</section>
		</ng-template>
	`
})
export class TooltipDemoPage implements OnInit {
	private dismissable: boolean = false;
	public myName = {
		name: "Tommy Thong Nguyen"
	};
	constructor() { }

	ngOnInit() {

	}
	changeName() {
		this.myName = {
			name: 'hong le'
		};
	}
	close($event) {
		$event.stopPropagation();
		console.log('let close this tooltip');
		this.changeName();
		//this.dismissable = true;
	}
	toggle($event){
		console.log('$event: ', $event);
	}
}
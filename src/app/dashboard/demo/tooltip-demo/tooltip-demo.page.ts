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
			<button class="btn btn-primary" tooltip="<h5>inner Tooltip {{myName.name}}</h5>"  placement="bottom" appendTo="target" >
				Tooltip  With Text and HTML
			</button>
		</div><hr />

		<button class="btn btn-primary" [tooltip]="tooltipTempl" [visible]="show"  placement="bottom"
				[tooltipContext]="myName" tooltipId="tmplId" trigger="click" (ontoggleTooltip)="toggle($event)"
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
	private show: boolean = false;
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
		this.show = false;
	}
	toggle($event){
		console.log('$event: ', $event);
		this.show = $event.show;
	}
}
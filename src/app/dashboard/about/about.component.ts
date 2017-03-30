import { Component, OnInit } from '@angular/core';

@Component({
	selector: 'about-page',
	template:`
		<section>
			<overlay [visible]="isShow" (onClose)="isToggle()"></overlay>
			<button (click)="isToggle()">Show</button>
		</section>
	`
})
export class AboutPageComponent implements OnInit {
	private isShow: boolean = false;
	constructor() {}

	ngOnInit() {
		
	}
	isToggle(){
		this.isShow = !this.isShow;
	}
}
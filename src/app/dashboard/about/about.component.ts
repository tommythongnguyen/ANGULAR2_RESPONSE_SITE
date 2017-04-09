import { Component, OnInit } from '@angular/core';

@Component({
	selector: 'about-page',
	template:`
		<section>
			<jumbotron side="center">
		        <page-title title="About"></page-title>
		        <section class=".jumb-body">
		            <img src="./assets/graphics/background/aboutme.jpg" width="100%">
		        </section>
		    </jumbotron>
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
import { Component, OnInit } from '@angular/core';

@Component({
	selector: 'demo-page',
	template:`
		<h1>Hello World</h1>
	`
})
export class DemoPageComponent implements OnInit {
	constructor() {}

	ngOnInit() {
		console.log('demo page');
	}
}
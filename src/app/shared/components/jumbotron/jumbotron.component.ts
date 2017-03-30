import { Component, Input, Inject} from '@angular/core';
import {DOCUMENT} from '@angular/platform-browser';
@Component({
	selector:'page-title',
	styleUrls:['./jumbotron.component.scss'],
	template:`
		<section class="page-title">
			<div class="header-title">{{pageTitle}}</div>
			<div class="header-message">Tommy Thong Nguyen - Software Engineer at BankOfAmerica</div>
			<a href="https://github.com/tommythongnguyen/Responsive-Personal-Website" class="btn btn-info">Visit Me</a>
		</section>
	`
})
export class PageTitleComponent{
	@Input('title') pageTitle: string = '';
	constructor( @Inject(DOCUMENT) private _document:any) { }
}

@Component({
	selector:'jumbotron',
	template:`
		<div class="jumbotron jumbotron-fluid" [style.textAlign]="position">
		  <div class="container">
			<ng-content></ng-content>   
		  </div>
		</div>
	`,
	styles:[``]
})
export class JumbotronComponent {
	@Input() position: string = "center";
}
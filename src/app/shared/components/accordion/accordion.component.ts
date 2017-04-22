import { Component, OnInit, Input, Output, EventEmitter, ContentChildren, QueryList, 
	AfterContentInit, AfterViewInit, ChangeDetectionStrategy, TemplateRef
} from '@angular/core';
import {trigger, state, style, transition, animate} from '@angular/animations';

let  prevName: string = "tab-";
@Component({
	selector: 'accordion',
	changeDetection:ChangeDetectionStrategy.OnPush,
	template:`
		<div id="accordion" role="tablist" aria-multiselectable="true">
		  	<ng-content></ng-content>
		</div>
	`
})
export class AccordionComponent implements OnInit, AfterViewInit{
	private _counter: number = 1; //number of Tab
	private _activeTab: AccordionTabComponent;
	private _Tabs = new Map<string, AccordionTabComponent>();
	//@ContentChildren(AccordionTabComponent) tabs: QueryList<AccordionTabComponent>;
	@Input() allowedMultipleOpen: boolean = false; //false: 1 tab open at time, true: allow to have multiple tab opend
	@Input() activeTabNumber:string|number;
	constructor() {}

	ngOnInit() {}
	ngAfterViewInit() {
		//let make sure all the tap first close
		this._Tabs.forEach((tab: AccordionTabComponent) => {
			tab.close();
		});

		if (this.activeTabNumber && Number(this.activeTabNumber)) {
			let preSelectTabId = prevName + Number(this.activeTabNumber);
			this._activeTab = this._Tabs.get(preSelectTabId);
			this._activeTab.open();
		}
		
	}
	
	registerTab(tab: AccordionTabComponent) {
		let tabId = prevName + this._counter;
		this._Tabs.set(tabId, tab);
		this._counter++;
	}

	switchTab(selectedTab: AccordionTabComponent) {
		if (this.allowedMultipleOpen){
			selectedTab.toggle();
		}else{//one open at a time
			if(this._activeTab === selectedTab){
				selectedTab.toggle();
			}else{
				this._Tabs.forEach((tab: AccordionTabComponent) => {
					if (tab !== selectedTab && tab.isOpen()) {
						tab.close();
					}
				});
				//open the active Tab content
				selectedTab.open();
			}
		}
		this._activeTab = selectedTab;
	}
}

@Component({
	selector:'accordion-tab',
	styleUrls:['./accordion.component.scss'],
	template:`
		<div class="card accordion-tab">
		    <div class="card-header tab-header" (click)="select($event)" [ngClass]="globalClass">
		      <h5 class="mb-0" *ngIf="!_tabTemplateTitle">{{_tabTitle}}</h5>
		      <ng-container [templateFactory]="_tabTemplateTitle" [context]="titleContext"></ng-container>
		    </div>

		    <div [@tabState]="_collapsed ? 'hidden':'visible' " (@tabState.done)="doneCollapse($event)" [class.tab-content-wrapper-overflown]="_collapsed || _animating">
		      <div class="card-block"> 
		         <ng-content></ng-content>
		      </div>
		    </div>
		</div>
	`,
	animations:[
		trigger('tabState',[
			state('visible',style({height:'*'})),
			state('hidden',style({height:0})),
			transition('visible<=>hidden', animate('400ms'))
		])
	]
})
export class AccordionTabComponent{
	private _tabTitle: string = '';
	private _tabTemplateTitle: TemplateRef<any>;
	private _allowedAnimation: boolean = false;
	private _collapsed: boolean = true;
	private _animating: boolean = false;
	@Input() globalClass: string;
	@Input() titleContext: any;
	@Input() set title(_title: string | TemplateRef<any>){
		if (typeof _title === "string") {
			this._tabTitle = _title;
		}
		else{
			this._tabTemplateTitle = _title;
		}
	}

	get title(): string | TemplateRef < any > {
		return this._tabTemplateTitle || this._tabTitle;
	}

	@Input()contentTemplate:TemplateRef<any>
	constructor(private _accordion: AccordionComponent){
		this._accordion.registerTab(this);
	}

	select(): boolean {
		if (!this._animating){
			this._accordion.switchTab(this);
			this._allowedAnimation = true;
			this._animating = true;
		}
		return false;
	}
	isOpen():boolean{
		return !this._collapsed;
	}
	close():void{
		this._collapsed = true;
	}
	open():void{
		if(this._collapsed){
			this._collapsed = false;
		}
	}
	toggle():boolean{
		this._collapsed = !this._collapsed;
		return false;
	}

	doneCollapse($event){
		if (this._allowedAnimation){
			this._allowedAnimation = false;
			this._animating = false;
		}
	}
}
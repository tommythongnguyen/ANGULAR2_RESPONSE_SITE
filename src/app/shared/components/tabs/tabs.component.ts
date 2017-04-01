import {
	Component, OnInit, Input, Output, AfterViewChecked, AfterContentInit, AfterContentChecked, ContentChildren, QueryList, forwardRef,
		  EventEmitter, Inject, OnChanges, SimpleChanges, TemplateRef
} from '@angular/core';
import { LoadingDirective } from '../loading';
import { ICard } from '../card';
interface ITab{
	header: string
}
//*********-----tab-content----***********
@Component({
	selector:'tab-content',
	styles:[`
		.tab-pane-custom {
		    margin-left: auto;
		    margin-right: auto;
		    padding-top:15px;
		}
		card{
		    	margin-bottom:15px;
		}
	`],
	template:`
		<div class="tab-pane tab-pane-custom row" role="tabpanel" [loading]="showLoading" spinner="show">
			<ng-container *ngIf="templf">
				<ng-container *ngTemplateOutlet="templf; context:{list:list}"></ng-container>	
			</ng-container>

			<ng-container *ngIf="!templf">
				<card *ngFor="let item of list" [card]="item" (onSelectCard)="selectItem($event)" class="col-sm-6 col-md-4"></card>
			</ng-container>
		</div>
	`
})
export class TabContentComponent{
	@Input() list: any[];
	@Input() showLoading: boolean = false;
	@Input() templf: TemplateRef<any>;

	selectItem(item:any){
		console.log('item: ', item);
	}
}

//**********-----tab-panel-----**********
@Component({
	selector:`tab`,
	styleUrls:['./tabs.component.scss'],
	template:`
		<li class="nav-item">
		    	<span class="nav-link" [class.activeTab]="header === _tabs.activeHeader" (click)="selectTab(tab)">{{header}}</span>
		</li>
	`
})
export class TabComponent{
	header: string;
	private _tab: ITab;
	@Input() set tab(item:ITab){
		this._tab = item;
		this.header = item.header;
	}
	get tab():ITab{
		return this._tab;
	}
	
	constructor(@Inject(forwardRef(()=>TabsComponent)) private _tabs:TabsComponent){}
	select(){
		//this.selected = true;
	}
	unSelect(){
		//this.selected = false;
	}

	selectTab(tab:ITab){
		this._tabs.updateTab(tab);
	}
}


@Component({
	selector: 'tabs',
	styleUrls: ['./tabs.component.scss'],
	template: ` 
		<ul class="nav nav-tabs nav-tab-header">
		  	<ng-content select="tab"></ng-content>
		</ul>

		<div class="tab-content">
			<ng-content select="tab-content"></ng-content>
		</div>`
})
export class TabsComponent implements OnInit, AfterContentInit{
	private _activeHeader: string;

	@Input('activeTab') set activeHeader(value:string){
		this._activeHeader = value;
	}
	get activeHeader():string{
		return this._activeHeader;
	}
	@Output('onSelect') onSelectTab: EventEmitter<any> = new EventEmitter<any>();
	@ContentChildren(TabComponent) tabs: QueryList<TabComponent>;

	ngOnInit(){}
	ngAfterContentInit(){
		if(this.activeHeader){
			this._checkSelectedTabPanel()
		}else{
			this.activeHeader = this.tabs.toArray()[0].header;
		}
	}

	private _checkSelectedTabPanel() {
		let tabArray = this.tabs.toArray();
		for(let tab of tabArray){
			if (tab.header === this.activeHeader) return;
		}
		console.log('tabs:', this.tabs);
		this.activeHeader = tabArray[0].header;
	}

	updateTab(tab:ITab){
		this.activeHeader = tab.header;
		console.log('activeHeader: ', this.activeHeader);
		this.onSelectTab.emit(tab);
	}
	

}
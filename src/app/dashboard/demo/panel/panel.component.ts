import { Component, OnInit, Input, Output, EventEmitter, TemplateRef, ChangeDetectionStrategy, OnChanges, SimpleChanges} from '@angular/core';
import {trigger, state, transition, style, animate} from '@angular/animations';

@Component({
	selector: 'panel',
	styleUrls:['./panel.component.scss'],
	//changeDetection: ChangeDetectionStrategy.OnPush,
	template:`
		<section class="panel-container" *ngIf="_showPanel" 
				[@panel]="_dismissed? 'hidden':'visible'" (@panel.done)="doneDimissPanel($event)">
			<div class="panel-header">
				<span class="panel-title">{{title}}</span>
				<span class="panel-controls">
					<i class ="fa" [ngClass]="{'fa-minus-square-o':!collapsed, 'fa-plus-square-o':collapsed}" aria-hidden="true" 
					  *ngIf="toggleable" (click)="toggleContentPanel()"></i>
					<i class="fa fa-times" aria-hidden="true" *ngIf="dismissable" (click)="dismiss()"></i>
				</span>

			</div>
			<div class="panel-content" [@panelContent]="collapsed? 'hidden':'visible'" 
				 [class.panel-content-wrapper-overflown]="collapsed ||animating" (@panelContent.done)="doneTogglePanel($event)">
				<div *ngIf="!contentTemplate" class="content-message">
					The story begins as Don Vito Corleone, the head of a New York Mafia family, oversees his daughter's wedding. 
					His beloved son Michael has just come home from the war, but does not intend to become part of his father's business. 
					Through Michael's life the nature of the family business becomes clear. 
					The business of the family is just like the head of the family, 
					kind and benevolent to those who give respect, 
					but given to ruthless violence whenever anything stands against the good of the family.
				</div>
				<ng-template [templateFactory]="contentTemplate" [context]=""></ng-template>
			</div>
		</section>
	`,
	animations:[
		trigger('panelContent', [
			state('visibile',style({height: '*'})),
			state('hidden',style({height:0})),
			transition('visible <=>hidden', animate('400ms cubic-bezier(0.86, 0, 0.07, 1)'))
		]),
		trigger ('panel',[
			state('visibile', style({ height: '*' })),
			state('hidden', style({ height: 0 })),
			transition('visible <=>hidden', animate('400ms cubic-bezier(0.86, 0, 0.07, 1)'))
		])
	]
})
export class PanelComponent {
	private _sourceEvent: string = "";
	private _showPanel: boolean = true;
	private _allowAminationChecked: boolean = false;
	private _dismissed: boolean = false;// true: entire panel will be dismissle
	private _doneDismissedAnimating: boolean = false; //use for panel animation removal  

	animating: boolean = false;

	@Input() collapsed: boolean = false;//default: show the panel-content
	@Input() toggleable: boolean = false; //true:// allow panel-content toggleable
	@Input() dismissable: boolean = false; //true: allow to self-delete the panel element itself
	@Input() showPanel: boolean = true;
	@Input() title: string;

	@Input() contentTemplate: TemplateRef<any>; p

	@Output() ontoggle: EventEmitter<Boolean> = new EventEmitter<Boolean>();
	@Output() onInternalDismissedPanel: EventEmitter<any> = new EventEmitter<any>();
	constructor() { }

	ngOnChanges(changes:SimpleChanges){
		if (changes['showPanel']) {
			this.togglePanel();
		}
	}
	toggleContentPanel(): boolean {
		if(this.animating){
			return false;
		}
		this.animating = true;
		this.collapsed = !this.collapsed;
		this.ontoggle.emit(this.collapsed);
		return false;
	}

	togglePanel():boolean{
		if (this.showPanel && this._dismissed) {//panel currently remove, want to add it back
			this._showPanel = this.showPanel;
			this._sourceEvent = "external";
			this.dismiss();
		}
		if (!this.showPanel && !this._dismissed) { //currently open and want to remove it}
			this._sourceEvent = "external";
			this.dismiss();
		}
		return false;
	}

	doneTogglePanel($event){
		this.animating = false;
	}

	dismiss():boolean{
		if (this._sourceEvent) {
			this._dismissed = !this.showPanel;
		}else{
			this._dismissed = true;
		}
		this._allowAminationChecked = true;
		return false;
	}
	
	doneDimissPanel($event) {
		if (this._allowAminationChecked) {//to prevent this function runing multiple times
			this._doneDismissedAnimating = true;
			this._allowAminationChecked = false;
			if (this._sourceEvent){
				this._showPanel = this.showPanel;
				this._sourceEvent = "";
			}else{
				this._showPanel = false;
				this.onInternalDismissedPanel.emit();
			}
			
		} 
	}
}
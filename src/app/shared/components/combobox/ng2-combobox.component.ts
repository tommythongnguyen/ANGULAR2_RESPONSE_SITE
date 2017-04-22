import { Component, OnInit, forwardRef, Input, Output, EventEmitter, ChangeDetectionStrategy, OnChanges, SimpleChanges, ViewChild, ElementRef, Renderer2, AfterViewInit, TemplateRef} from '@angular/core';
import {NG_VALUE_ACCESSOR, ControlValueAccessor} from '@angular/forms';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { ElementCalculation } from '../../dom';
export interface IOption{
	lable: string;
	value: any;
}
export type MENU_POSITION = 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
export const COMBOBOX_VALUE_ACCESSOR:any ={
	provide:NG_VALUE_ACCESSOR,
	useExisting:forwardRef(()=>Ng2ComboboxComponent),
	multi:true
};

@Component({
	selector: 'combobox-footer',
	template:`
		<ng-content></ng-content>
	`
})
export class ComboboxFooterComponent{}

@Component({
	selector: 'ng2-combobox',
	changeDetection:ChangeDetectionStrategy.OnPush,
	styleUrls:['./ng2-combobox.component.scss'],
	template:`
			<div #comboboxContainer class="btn-group combobox-container" (click)="toggle()" [style.width]="_width">
			  <div class="btn btn-label">{{_selectOption?.label || label}}</div>
			  <div type="button" class="btn btn-default dropdown-toggle dropdown-toggle-split" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
			    <span class="sr-only"></span>
			  </div>
			  <div #menuContainer class="dropdown-menu menu-container {{menuPosition}}" aria-labelledby="dropdownMenuButton"
			  		[@dropdownState]="_toggleMenu? 'visible':'hidden'" [style.width]="_width">
			  	<input #optionFilter type="text" *ngIf="filterable" class="filter-input" (input)=" _filteredValue = $event.target.value">
			  	
			  	<div #optionContainer>
			  		<div *ngFor ="let option of options | ItemFilterPipe: _filteredValue: field" class="option-item"
			  			(click)="selectOption(option)" [class.active-selection]="_selectOption?.value === option.value">
						<button *ngIf="!optionTemplate"  class="dropdown-item cropText">{{option.label}}</button>
						
						<ng-container *ngTemplateOutlet="optionTemplate; context: option"></ng-container>
			  		</div>
			  	</div>
			  	<ng-container *ngTemplateOutlet="footerTemplate"></ng-container>
			  	<ng-content select="combobox-footer"></ng-content>
			  </div>
			</div>
	`,
	animations:[
		trigger('dropdownState',[
			state('hidden', style({opacity:0, height:0})),
			state('visible', style({ opacity: 1, height: '*' })),
			transition('visible => hidden', animate('400ms ease-in')),
			transition('hidden => visible', animate('400ms ease-out'))
		])
	],
	providers:[COMBOBOX_VALUE_ACCESSOR]
})
export class Ng2ComboboxComponent implements OnInit, OnChanges, AfterViewInit, ControlValueAccessor{
	private _filterField: string = '';
	private _filteredValue: string = '';
	private _width: string;
	private _selectOption: IOption;
	private _toggleMenu: boolean = false;
	onChangeFn: Function = () => { };
	onTouchedFn: Function = () => { };

	@ViewChild('optionFilter') optionFilter: ElementRef;
	@ViewChild('optionContainer') optionContainer: ElementRef;
	@ViewChild('menuContainer') menuContainer: ElementRef;
	@ViewChild('comboboxContainer') comboboxContainer: ElementRef; 
	
	@Output() onselect: EventEmitter<IOption> = new EventEmitter<IOption>();
	@Output() onToggle: EventEmitter<Boolean> = new EventEmitter<Boolean>();

	@Input() options: IOption[];
	@Input() label: string; 
	@Input() stayOpen: boolean = false; //will open the combobox menu forever
	@Input() open: boolean = false;// allow user to open the combobox menu from outside
	@Input() filterable: boolean = false;// allow filter the options
	@Input() height: string;
	@Input() menuPosition: MENU_POSITION = "bottom-left";
	@Input() separatorBefore: string; //after target's label
	@Input() optionTemplate: TemplateRef<any>; //custom MenuOption Item
	@Input() footerTemplate: TemplateRef<any>;
	@Input() set field(value: string) {// the field which we would like to apply the filter
		this._filterField = value;
	}
	get field(): string {
		return this._filterField;
	}
	@Input() set width(value:string){ //fixed width for combobox
		this._width = value;
		if (value.indexOf('%') === -1){ //this not the percentage
			this._width = parseInt(value) + 'px';
		}
	}
	get width():string{
		return this._width;
	}
	constructor(private _renderer2: Renderer2, private _elementCalculation: ElementCalculation) { }

	ngOnInit() {}
	ngOnChanges(changes:SimpleChanges){
		if (changes['stayOpen'] && changes['stayOpen'].currentValue) {
			this._toggleMenu = true;
		}
		if (changes['open'] && !this.stayOpen){
			this._toggleMenu = this.open;
		}
	}
	ngAfterViewInit(){
		if(this.optionFilter){
			this._renderer2.listen(this.optionFilter.nativeElement, 'click', this.filterOptions.bind(this));
			//check if user set height for combobox
			if(this.height){
				let tempHeight = this._elementCalculation.getOuterHeight(this.optionContainer.nativeElement);
				if(tempHeight >parseInt(this.height)){
					//set height to optionContainer
					this._renderer2.addClass(this.optionContainer.nativeElement, 'overflow');
				}
				this._renderer2.setStyle(this.optionContainer.nativeElement, 'height', parseInt(this.height) + 'px');
			}
		}
		if (this.separatorBefore) {
			//add the separator to the 
			let options = this.optionContainer.nativeElement.children;
			for(let option of options){
				if (option.textContent.trim() === this.separatorBefore) {
					// insert seperator after this one
					let separator:HTMLDivElement = this.createSeparator();
					this._renderer2.insertBefore(this.optionContainer.nativeElement, separator, option);
					break;
				}
			}
		}
		if (this.menuPosition) {
			if (this.menuPosition === "top-left" || this.menuPosition === "top-right") {
				this._renderer2.addClass(this.comboboxContainer.nativeElement, 'dropup');
			}
			if (this.menuPosition === "top-right" || this.menuPosition === "bottom-right") {
				this._renderer2.addClass(this.menuContainer.nativeElement, 'dropdown-menu-right');
			}
		}	
	}

	createSeparator():HTMLDivElement{
		let separator = this._renderer2.createElement('div');
		this._renderer2.addClass(separator, 'dropdown-divider');
		this._renderer2.setProperty(separator, 'role', 'separator');
		return separator;
	}
	writeValue(value:any){
		this._selectOption = value;
		console.log('value: ', value);
	}
	registerOnChange(fn:Function){
		console.log('onCHange');
		this.onChangeFn = fn;
	}
	registerOnTouched(fn:Function){
		this.onTouchedFn = fn;
	}
	selectOption(option):boolean{
		this.onChangeFn(option);
		this.writeValue(option);
		this.onselect.emit(option);
		return false;
	}
	toggle(){
		if (!this.stayOpen) {
			if(!this._toggleMenu && this.optionFilter){ //will open the menu
				this.optionFilter.nativeElement.focus();
			}
			this._toggleMenu = !this._toggleMenu;
			this.onToggle.emit(this._toggleMenu);
		}
	}

	filterOptions($event){
		$event.stopPropagation();
	}
}
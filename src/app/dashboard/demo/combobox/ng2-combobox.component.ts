import { Component, OnInit, forwardRef, Input, Output, EventEmitter, ChangeDetectionStrategy, OnChanges, SimpleChanges, ViewChild, ElementRef, Renderer2, AfterViewInit} from '@angular/core';
import {NG_VALUE_ACCESSOR, ControlValueAccessor} from '@angular/forms';
import { trigger, state, style, transition, animate } from '@angular/animations';
export interface IOption{
	lable: string;
	value: any;
}
export const COMBOBOX_VALUE_ACCESSOR:any ={
	provide:NG_VALUE_ACCESSOR,
	useExisting:forwardRef(()=>Ng2ComboboxComponent),
	multi:true
};
@Component({
	selector: 'ng2-combobox',
	changeDetection:ChangeDetectionStrategy.OnPush,
	styleUrls:['./ng2-combobox.component.scss'],
	template:`
			<div class="btn-group combobox-container" (click)="toggle()" [style.width]="_width">
			  <div class="btn btn-label">{{_selectOption?.label || label}}</div>
			  <div type="button" class="btn btn-default dropdown-toggle dropdown-toggle-split" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
			    <span class="sr-only">Toggle Dropdown</span>
			  </div>
			  <div class="dropdown-menu dropdown-container" aria-labelledby="dropdownMenuButton"
			  		[@dropdownState]="_toggleMenu? 'visible':'hidden'" [style.width]="_width">
			  	<input #optionFilter type="text" *ngIf="filterable" class="filter-input" (input)=" _filteredValue = $event.target.value">
			  	<div>
					<button class="dropdown-item" *ngFor ="let option of options | ItemFilterPipe: _filteredValue: filterField" 
			  			(click)="selectOption(option)" [class.active-selection]="_selectOption?.value === option.value">
			  		{{option.label}}
			  	</button>
			  	</div>
			  	
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
	private _filteredValue: string = '';
	private _width: string;
	private _selectOption: IOption;
	private _toggleMenu: boolean = false;
	onChangeFn: Function = () => { };
	onTouchedFn: Function = () => { };

	@ViewChild('optionFilter') optionFilter: ElementRef;
	@Output() onselect: EventEmitter<IOption> = new EventEmitter<IOption>();
	@Output() onToggle: EventEmitter<Boolean> = new EventEmitter<Boolean>();
	@Input() options: IOption[];
	@Input() label: string; 
	@Input() stayOpen: boolean = false; //will open the combobox menu forever
	@Input() open: boolean = false;// allow user to open the combobox menu from outside
	@Input() filterable: boolean = false;// allow filter the options
	@Input() filterField: string = '';// the field which we would like to apply the filter
	@Input() set width(value:string){ //fixed width for combobox
		this._width = value;
		console.log('this._width :', this._width);
		if (value.indexOf('%') === -1){ //this not the percentage
			this._width = parseInt(value) + 'px';

		}
	}
	get width():string{
		return this._width;
	}
	constructor(private _renderer2: Renderer2) {}

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
		}
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
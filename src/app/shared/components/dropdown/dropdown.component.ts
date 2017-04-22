import { Component, OnInit, forwardRef, Input, Output, EventEmitter, ChangeDetectionStrategy, AfterViewInit, Renderer2, ViewChild, ElementRef} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR} from '@angular/forms';
import {trigger, state, style, transition, animate} from '@angular/animations';

export type DROPDOWN_MENU_POSITION = "top-left" | "top-right" | "bottom-left" | "bottom-right";

export const DROPBOWN_VALUE_ACCESSOR: any = {
	provide: NG_VALUE_ACCESSOR,
	useExisting: forwardRef(() => DropdownComponent),
	multi: true
};
@Component({
	selector: 'dropdown',
	styleUrls:['./dropdown.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
	template:`
		<div class="btn-group dropdown-container" #dropdownContainer (click)="toggle($event)" >
			<button class="btn btn-secondary"  aria-haspopup="true" aria-expanded="false">
			    {{_selectedOption|| label}}
			</button>
			<button type="button" class="btn btn-sm btn-secondary dropdown-toggle dropdown-toggle-split" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
			    <span class="sr-only"></span>
			</button>
			
			<div #menuContainer class="dropdown-menu option-container" [@dropdownState]="_toggleDropdown? 'visible':'hidden'">
			  	<div *ngFor="let option of options" (click)="selectOption(option)" [class.active]="_selectedOption === option">
					<button class="dropdown-item">{{option}}</button>
			  	</div>
			</div>
		</div>
	`,
	providers: [DROPBOWN_VALUE_ACCESSOR],
	animations:[
		trigger('dropdownState',[
			state("visible", style({opacity:1})),
			state('hidden',style({opacity:0})),
			transition('visible => hidden', animate('400ms ease-in')),
			transition('hidden => visible', animate('400ms ease-out'))
		])
	]
})

export class DropdownComponent implements OnInit, ControlValueAccessor, AfterViewInit {
	onChangeFn: Function;
	onTouchedFn: Function;
	private _selectedOption: any;
	private _toggleDropdown: boolean = false;

	@ViewChild('dropdownContainer') dropdownContainer: ElementRef;
	@ViewChild('menuContainer') menuContainer: ElementRef;
	@Output() onselect: EventEmitter<any> = new EventEmitter<any>();
	@Input() label: string = "Choose";
	@Input() options: string[] = [];
	@Input() menuPosition: DROPDOWN_MENU_POSITION = "bottom-left";
	constructor(private _renderer2:Renderer2) {}

	ngOnInit() {}

	ngAfterViewInit(){
		if(this.menuPosition){
			if (this.menuPosition === "top-left" || this.menuPosition === "top-right") {
				this._renderer2.addClass(this.dropdownContainer.nativeElement, 'dropup');
			}
			if (this.menuPosition === "top-right" || this.menuPosition === "bottom-right") {
				this._renderer2.addClass(this.menuContainer.nativeElement, 'dropdown-menu-right');
			}
		}	
	}
	selectOption(option): boolean {
		this.writeValue(option);
		this.onChangeFn(option);
		this.onselect.emit(option);
		return false;
	}
	toggle($event):boolean{
		$event.stopPropagation();
		this._toggleDropdown = !this._toggleDropdown;
		return false;
	}
	writeValue(value: any) {
		this._selectedOption = value;
	}
	registerOnChange(fn:Function){
		this.onChangeFn = fn;
	}
	registerOnTouched(fn:Function){
		this.onTouchedFn = fn;
	}
}
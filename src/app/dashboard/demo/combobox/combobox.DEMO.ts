import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
@Component({
	selector: 'combobox-demo',
	styleUrls: ['./combobox.DEMO.scss'],
	template: `
		<form [formGroup]="myForm" (ngSubmit)="submitForm(myForm.value)">
			<ng2-combobox [options]="comboboxOptions" formControlName="combo"
					label="Choose"  [open]="isOpen" [filterable]="true" width="120px" height="160px"
					 menuPosition="bottom-left" separatorBefore="{{comboboxOptions[1].label}}"
					(onselect)=selectOption($event) (onToggle)="isOpen = !isOpen" [field]="filterField"
					[optionTemplate]="optionTmplf" [footerTemplate]="footerTmplf">

				<!--this is user defined menu-option -->
				<ng-template #optionTmplf let-label="label"> 
					<div class="templ-option">
						<span class="cropText">{{label}}</span>
						<i class="fa fa-car option-icon" aria-hidden="true"></i>
					</div>
				</ng-template>

				<!--this is user defined combobox-footer -->
				<ng-template #footerTmplf>
					<div>
						<dropdown [options]="dropdownOptions" [formControl]="dropdownControl"
								menuPosition="top-left"	(onselect)="onSelectDropdown($event)"></dropdown>
					</div>
					
				</ng-template>

				<combobox-footer>
					
				</combobox-footer>

			</ng2-combobox>
			<button type="submit">Submit</button>
		</form>
	`
})
export class ComboboxDEMO implements OnInit {
	private filterField: string;
	public myForm: FormGroup;
	public comboboxOptions = [];
	public dropdownOptions = [];

	dropdownControl: FormControl;

	selectItem: string;
	isOpen = false;
	constructor() { }

	ngOnInit() {
		this.dropdownOptions = [
			'label', 'value'
		];
		this.comboboxOptions = [
			{ label: 'item1', value: "value1" },
			{ label: 'item2', value: "value2" },
			{ label: 'item3- this is a very long items label', value: "value3" },
			{ label: 'item4', value: "value4" },
			{ label: 'Item5', value: "value5" },
		];
		this.selectItem = this.comboboxOptions[0];

		this.myForm = new FormGroup({
			combo: new FormControl(this.comboboxOptions[3])
		});

		this.dropdownControl = new FormControl(this.dropdownOptions[0]);
		this.filterField = this.dropdownOptions[0];
	}
	selectOption(selectedOption) {
		console.log('selectedOption: ', selectedOption);
	}
	submitForm(value) {
		console.log('form value:', value);
		this.isOpen = !this.isOpen;
	}
	onClickBtn(): boolean {
		console.log('you click me: ');
		return false;
	}
	onSelectDropdown(option) {
		console.log('onSelectDropdown: ', option);
		this.filterField = option;
	}
}
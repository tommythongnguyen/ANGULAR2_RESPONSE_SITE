import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup} from '@angular/forms';
@Component({
	selector: 'demo-page',
	template:`
		<form [formGroup]="myForm" (ngSubmit)="submitForm(myForm.value)">
			<ng2-combobox [options]="comboboxOptions" formControlName="combo"
					label="Choose" width="120px" [open]="isOpen" [filterable]="true" filterField="label"
					(onselect)=selectOption($event) (onToggle)="isOpen = !isOpen"></ng2-combobox>
			<button type="submit">Submit</button>
		</form>
	`
})
export class DemoPageComponent implements OnInit {
	public myForm: FormGroup;
	public comboboxOptions = [];
	selectItem: string;
	isOpen= false;
	constructor() {}

	ngOnInit() {
		console.log('demo page');
		this.comboboxOptions = [
			{ label: 'item1', value: "value1" },
			{ label: 'item2', value: "value2" },
			{ label: 'item3sfsfsdfsdfdsfsfsfsfsfds', value: "value3" }
		];
		this.selectItem = this.comboboxOptions[0];

		this.myForm = new FormGroup({
			combo: new FormControl(this.comboboxOptions[2])
		});
	}
	selectOption(selectedOption){
		console.log('selectedOption: ', selectedOption);
	}
	submitForm(value){
		console.log('form value:', value);
		this.isOpen = !this.isOpen;
	}
}
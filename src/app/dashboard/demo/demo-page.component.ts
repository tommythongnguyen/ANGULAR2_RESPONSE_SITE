import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup} from '@angular/forms';
@Component({
	selector: 'demo-page',
	template:`
		<accordion-demo></accordion-demo>
	`
})
export class DemoPageComponent implements OnInit {
	private filterField: string;
	public myForm: FormGroup;
	public comboboxOptions = [];
	public dropdownOptions = [];
	
	dropdownControl: FormControl;

	selectItem: string;
	isOpen= false;
	constructor() {}

	ngOnInit() {
		this.dropdownOptions = [
			'label','value'
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
	selectOption(selectedOption){
		console.log('selectedOption: ', selectedOption);
	}
	submitForm(value){
		console.log('form value:', value);
		this.isOpen = !this.isOpen;
	}
	onClickBtn():boolean{
		console.log('you click me: ');
		return false;
	}
	onSelectDropdown(option){
		console.log('onSelectDropdown: ', option);
		this.filterField = option;
	}
}
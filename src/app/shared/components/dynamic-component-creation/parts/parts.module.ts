import {NgModule, forwardRef} from '@angular/core';
import {CommonModule} from "@angular/common";
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {StringEditor} from './string-editor';
import {TextEditor} from './text-editor';

export const DYNAMIC_COMPONENTS=[
	forwardRef(() => StringEditor),
	forwardRef(() => TextEditor)
]
@NgModule({
	declarations: [DYNAMIC_COMPONENTS],
	imports: [CommonModule, FormsModule, ReactiveFormsModule],
	exports:[
		DYNAMIC_COMPONENTS,
		CommonModule, FormsModule, ReactiveFormsModule
	]
})
export class PartsModule{
	static forRoot(){
		return{
			ngModule: PartsModule,
			providers:[] // not used here, but if singleton needed
		}
	}
}
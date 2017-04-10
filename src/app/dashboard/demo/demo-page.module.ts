import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {DemoPageComponent} from './demo-page.component';
import { Ng2ComboboxComponent } from './combobox';
import { ItemFilterPipe } from './pipes';

const directives =[
	DemoPageComponent,
	Ng2ComboboxComponent,
	ItemFilterPipe
]
@NgModule({
	declarations:[...directives],
	imports:[
		CommonModule,
		FormsModule,
		ReactiveFormsModule,
		BrowserAnimationsModule
	]
})

export class DemoPageModule{}
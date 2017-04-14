import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {DemoPageComponent} from './demo-page.component';
import { Ng2ComboboxComponent, ComboboxFooterComponent } from './combobox';
import { DropdownComponent } from './dropdown';
import { ItemFilterPipe } from './pipes';

const directives =[
	DemoPageComponent,
	Ng2ComboboxComponent,
	ComboboxFooterComponent,
	DropdownComponent,
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
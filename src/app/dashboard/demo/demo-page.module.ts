import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {DemoPageComponent} from './demo-page.component';
import { Ng2ComboboxComponent, ComboboxFooterComponent, ComboboxDEMO } from './combobox';
import { DropdownComponent } from './dropdown';
import { PanelComponent, PanelDemoComponent } from './panel';
import {AccordionComponent, AccordionTabComponent, AccordionDEMO} from './accordion';

//------import directives-----------
import { TemplateFactoryDirective } from './template-factory';

//------import Pipes---------------
import { ItemFilterPipe } from './pipes';

const directives =[
	DemoPageComponent,
	Ng2ComboboxComponent, ComboboxDEMO,
	ComboboxFooterComponent,
	DropdownComponent,
	PanelComponent, PanelDemoComponent,
	TemplateFactoryDirective,
	AccordionComponent, AccordionTabComponent, AccordionDEMO,
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
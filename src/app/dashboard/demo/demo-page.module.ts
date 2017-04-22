import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule} from '@angular/router';

import { SharedComponentModule } from '../../shared';
import {DemoPageComponent} from './demo-page.component';
import { AccordionDemoPage } from './accordion-demo';
import { ComboboxDemoPage } from './combobox-demo';
import { TooltipDemoPage } from './tooltip-demo';
const directives =[
	DemoPageComponent,
	AccordionDemoPage,
	ComboboxDemoPage,
	TooltipDemoPage
]
@NgModule({
	declarations:[...directives],
	imports:[
		CommonModule,
		FormsModule,
		ReactiveFormsModule,
		BrowserAnimationsModule,
		SharedComponentModule,
		RouterModule
	],
	entryComponents: []
})

export class DemoPageModule{}
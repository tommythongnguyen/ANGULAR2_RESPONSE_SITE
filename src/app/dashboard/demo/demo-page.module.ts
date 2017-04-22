import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule} from '@angular/router';

import { SharedComponentModule } from '../../shared';
import { DynamicCreationModule } from '../../shared/components/dynamic-component-creation';
import {DemoPageComponent} from './demo-page.component';
import { AccordionDemoPage } from './accordion-demo';
import { ComboboxDemoPage } from './combobox-demo';
import { TooltipDemoPage } from './tooltip-demo';
import { DynamicComponentGenerationDemoPage } from './dynamic-component-generation-demo';
const directives =[
	DemoPageComponent,
	AccordionDemoPage,
	ComboboxDemoPage,
	TooltipDemoPage,
	DynamicComponentGenerationDemoPage
]
@NgModule({
	declarations:[...directives],
	imports:[
		CommonModule,
		FormsModule,
		ReactiveFormsModule,
		BrowserAnimationsModule,
		SharedComponentModule,
		DynamicCreationModule.forRoot(),
		RouterModule
	],
	entryComponents: []
})

export class DemoPageModule{}
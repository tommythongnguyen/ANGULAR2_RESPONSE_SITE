import {Routes} from '@angular/router';
import {DemoPageComponent} from './demo-page.component';
import { AccordionDemoPage } from './accordion-demo';
import { ComboboxDemoPage } from './combobox-demo';
import { TooltipDemoPage } from './tooltip-demo';
import { DynamicComponentGenerationDemoPage } from './dynamic-component-generation-demo';
export const DEMO_ROUTES: Routes=[
	{	path:'', 
		component:DemoPageComponent,
		children:[
			{
				path: '',
				component: TooltipDemoPage ,
			},
			{
				path: 'accordion',
				component: AccordionDemoPage,
			},
			{
				path: 'combobox',
				component: ComboboxDemoPage,
			},
			{
				path:'tooltip',
				component: AccordionDemoPage
			},
			{
				path:'dynamic-component',
				component: DynamicComponentGenerationDemoPage
			}
		]
	}
];
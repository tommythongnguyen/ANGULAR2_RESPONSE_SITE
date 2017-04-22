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
				component: AccordionDemoPage,
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
				component: TooltipDemoPage
			},
			{
				path:'dynamic-component',
				component: DynamicComponentGenerationDemoPage
			}
		]
	}
];
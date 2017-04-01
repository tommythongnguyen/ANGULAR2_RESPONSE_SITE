import { Routes, RouterModule} from '@angular/router';

const DefaultRoutes = [
	{ path: '', redirectTo: 'admin', pathMatch: 'full' }
];
const RedirectRoutes = [
	{ path: '**', redirectTo: 'admin', pathMatch: 'full' }
];
const LazyRoutes = [
	//{ path: 'dashboard', loadChildren: './dashboard/dashboard.module#DashboardModule' }
	{ path: 'pages', redirectTo: 'dashboard', pathMatch: 'full' }
];
export const ROUTES = [
	...DefaultRoutes,
	...LazyRoutes,
	...RedirectRoutes
];


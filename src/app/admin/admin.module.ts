import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {RouterModule} from '@angular/router';
//-----sharedComponentModule---
import {SharedComponentModule} from '../shared';

import { ROUTES } from './admin.routes';

import {AdminService, LocalDatabaseService} from './services';

//---import Guards----------
import { CancelRegisterGuard, LoginGuard } from './guards';
//------import Components---------
import {UserLoginComponent} from './login/login.component';
import {UserRegisterComponent} from './register/register.component';
import {UserAccountComponent} from './account/account.component';

const adminDirectives:any[]=[
    UserLoginComponent,
    UserRegisterComponent,
    UserAccountComponent
];
const importModules:any[]=[
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SharedComponentModule,
    RouterModule.forChild(ROUTES)
];

@NgModule({
    declarations:adminDirectives,
    imports:importModules,
    providers:[
       AdminService, 
       LocalDatabaseService,
       CancelRegisterGuard, 
       LoginGuard
    ]
})
export class AdminModule{}
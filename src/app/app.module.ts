import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule} from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule, PreloadingStrategy, PreloadAllModules } from '@angular/router';

import { AdminModule } from './admin';
import { AppComponent } from './app.component';

import { ROUTES } from './app.routes';

import { ElementCalculation } from './shared';
@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpModule,
	RouterModule.forRoot(ROUTES, 
    {preloadingStrategy:PreloadAllModules}),
	AdminModule
  ],
  providers: [ElementCalculation],
  bootstrap: [AppComponent]
})
export class AppModule { }

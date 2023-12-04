import { NgModule } from '@angular/core';
import { BrowserModule, provideClientHydration } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { H2oComponent } from './h2o/h2o.component';
import { ContentComponent } from './content/content.component';
import { HeaderComponent } from './header/header.component';
import { NavBarComponent } from './nav-bar/nav-bar.component';
import {FormsModule} from "@angular/forms";
import {CommonModule, HashLocationStrategy, LocationStrategy} from "@angular/common";

@NgModule({
  declarations: [
    AppComponent,
    H2oComponent,
    ContentComponent,
    HeaderComponent,
    NavBarComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    CommonModule
  ],
  providers: [
    provideClientHydration(),{ provide: LocationStrategy, useClass: HashLocationStrategy }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

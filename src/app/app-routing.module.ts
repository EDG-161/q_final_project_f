import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {ContentComponent} from "./content/content.component";
import {H2oComponent} from "./h2o/h2o.component";
import {HashLocationStrategy, LocationStrategy} from "@angular/common";

const routes: Routes = [
  { path: '', component: ContentComponent },
  { path: 'p_hydrogen', component: H2oComponent },
];

@NgModule({

  imports: [
    RouterModule.forRoot(routes,{
      useHash: true
    })],
  exports: [RouterModule]
})
export class AppRoutingModule { }

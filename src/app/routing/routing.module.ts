import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {RouterModule, Routes} from '@angular/router';
import { HomeComponent } from '../home/home/home.component';
import { DashboardComponent } from '../dashboard/dashboard/dashboard.component';
import { DeveloperHomeComponent } from '../dashboard/developer-home/developer-home.component';
import { DeveloperCreateFormComponent } from '../dashboard/developer-create-form/developer-create-form.component';



const appRoutes: Routes = [
     { path: '', redirectTo: 'home', pathMatch: 'full' },
     { path: 'home' , component: HomeComponent},
     { path: 'dashboard' , component: DashboardComponent},
     { path: 'developper' , component: DeveloperHomeComponent},
     { path: 'createForm' , component: DeveloperCreateFormComponent}
] ;


@NgModule({
  imports: [
    CommonModule ,
    RouterModule.forRoot(appRoutes , {})
  ],
  declarations: [],
  exports: [RouterModule]
})
export class RoutingModule { }

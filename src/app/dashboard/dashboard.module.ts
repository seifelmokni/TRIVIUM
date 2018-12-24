import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './header/header.component';
import { SvgSpiritComponent } from './svg-spirit/svg-spirit.component';
import { HomeComponent } from './home/home.component';
import { FooterComponent } from './footer/footer.component';
import { NavComponent } from './nav/nav.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { DeveloperHomeComponent } from './developer-home/developer-home.component';
import { RouterModule } from '@angular/router';
import { DeveloperCreateFormComponent } from './developer-create-form/developer-create-form.component';

@NgModule({
    imports: [
        CommonModule,
        RouterModule
    ],
    declarations: [HeaderComponent,
        SvgSpiritComponent,
        HomeComponent,
        FooterComponent,
        NavComponent,
        DashboardComponent,
        DeveloperHomeComponent,
        DeveloperCreateFormComponent]
})
export class DashboardModule { }

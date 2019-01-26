import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { RegisterComponent } from './register/register.component';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { CandidatComponent } from './candidat/candidat.component';
import { RouterModule } from '@angular/router';
import { FormSubmittedComponent } from './form-submitted/form-submitted.component';
import { CalendarModule } from 'angular-calendar';
import { DateAdapter } from '@angular/material';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { UpdatePasswordComponent } from './update-password/update-password.component';
import { PasswordupdatedComponent } from './passwordupdated/passwordupdated.component';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        RouterModule,
        CalendarModule.forRoot({
            provide: DateAdapter,
            useFactory: adapterFactory
        }),
        NgbModule
    ],
    declarations: [LoginComponent,
        HomeComponent,
        RegisterComponent,
        HeaderComponent,
        FooterComponent,
        CandidatComponent,
        FormSubmittedComponent,
        UpdatePasswordComponent,
        PasswordupdatedComponent]
})
export class HomeModule { }

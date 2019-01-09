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

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        RouterModule
    ],
    declarations: [LoginComponent,
        HomeComponent,
        RegisterComponent,
        HeaderComponent,
        FooterComponent,
        CandidatComponent,
        FormSubmittedComponent]
})
export class HomeModule { }

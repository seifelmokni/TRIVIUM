import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from '../home/home/home.component';
import { DashboardComponent } from '../dashboard/dashboard/dashboard.component';
import { DeveloperHomeComponent } from '../dashboard/developer-home/developer-home.component';
import { DeveloperCreateFormComponent } from '../dashboard/developer-create-form/developer-create-form.component';
import { DeveloperEditFormComponent } from '../dashboard/developer-edit-form/developer-edit-form.component';
import { FormfillingComponent } from '../dashboard/formfilling/formfilling.component';
import { UserComponent } from '../dashboard/user/user.component';
import { PermissionComponent } from '../dashboard/permission/permission.component';
import { NewPermissionComponent } from '../dashboard/new-permission/new-permission.component';
import { ModelsComponent } from '../dashboard/communications/models/models.component';
import { DocumentsComponent } from '../dashboard/communications/documents/documents.component';
import { AddModelComponent } from '../dashboard/communications/add-model/add-model.component';
import { EditModelComponent } from '../dashboard/communications/edit-model/edit-model.component';
import { CandidatComponent } from '../home/candidat/candidat.component';
import { FormSubmittedComponent } from '../home/form-submitted/form-submitted.component';
import { AdmissionsComponent } from '../dashboard/admissions/admissions.component';
import { ResidentsComponent } from '../dashboard/residents/residents.component';
import { CandidateDetailsComponent } from '../dashboard/candidate-details/candidate-details.component';
import { CandidateEntreviewComponent } from '../dashboard/candidate-entreview/candidate-entreview.component';
import { ConfigurationComponent } from '../dashboard/configuration/configuration.component';
import { CalendarComponent } from '../dashboard/calendar/calendar.component';



const appRoutes: Routes = [
    { path: '', redirectTo: 'home', pathMatch: 'full' },
    { path: 'home', component: HomeComponent },
    { path: 'dashboard', component: DashboardComponent },
    { path: 'developper', component: DeveloperHomeComponent },
    { path: 'createForm', component: DeveloperCreateFormComponent },
    { path: 'editForm', component: DeveloperEditFormComponent },
    { path: 'preview', component: FormfillingComponent },
    { path: 'user', component: UserComponent },
    { path: 'permission', component: PermissionComponent },
    { path: 'newPermission', component: NewPermissionComponent },
    { path: 'models', component: ModelsComponent },
    { path: 'documents', component: DocumentsComponent },
    { path: 'addModel', component: AddModelComponent },
    { path: 'editModel', component: EditModelComponent },
    { path: 'submitCandidature', component: CandidatComponent },
    { path: 'candutureSubmitted', component: FormSubmittedComponent },
    { path: 'admissions', component: AdmissionsComponent },
    { path: 'residents', component: ResidentsComponent },
    { path: 'candidateDetails' , component: CandidateDetailsComponent},
    { path: 'intreview' , component: CandidateEntreviewComponent},
    { path: 'configuation' , component: ConfigurationComponent},
    { path: 'calendar' , component: CalendarComponent}
];


@NgModule({
    imports: [
        CommonModule,
        RouterModule.forRoot(appRoutes, {})
    ],
    declarations: [],
    exports: [RouterModule]
})
export class RoutingModule { }

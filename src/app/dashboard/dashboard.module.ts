import { NgModule } from '@angular/core';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { CommonModule } from '@angular/common';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { HeaderComponent } from './header/header.component';
import { SvgSpiritComponent } from './svg-spirit/svg-spirit.component';
import { HomeComponent } from './home/home.component';
import { FooterComponent } from './footer/footer.component';
import { NavComponent } from './nav/nav.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { DeveloperHomeComponent } from './developer-home/developer-home.component';
import { RouterModule } from '@angular/router';
import { DeveloperCreateFormComponent } from './developer-create-form/developer-create-form.component';
import { DeveloperEditFormComponent } from './developer-edit-form/developer-edit-form.component';
import { FormfillingComponent } from './formfilling/formfilling.component';
import { UserComponent } from './user/user.component';
import { PermissionComponent } from './permission/permission.component';
import { NewPermissionComponent } from './new-permission/new-permission.component';
import { AddUserPopupComponent } from './popup/add-user-popup/add-user-popup.component';
import { MatDialogModule } from '@angular/material';
import { FormsModule } from '@angular/forms';
import { ModelsComponent } from './communications/models/models.component';
import { DocumentsComponent } from './communications/documents/documents.component';
import { AddModelComponent } from './communications/add-model/add-model.component';
import { EditModelComponent } from './communications/edit-model/edit-model.component';
import { AdmissionsComponent } from './admissions/admissions.component';
import { ResidentsComponent } from './residents/residents.component';
import { CandidateDetailsComponent } from './candidate-details/candidate-details.component';
import { CandidateEntreviewComponent } from './candidate-entreview/candidate-entreview.component';
import { DragulaModule } from 'ng2-dragula';
import { ConfigurationComponent } from './configuration/configuration.component';
import { DeleteAlertPopupComponent } from './popup/delete-alert-popup/delete-alert-popup.component';
import { CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { CalendarComponent } from './calendar/calendar.component';
import { DiscardChangesPopupComponent } from './popup/discard-changes-popup/discard-changes-popup.component';
import { FixInterviewDateComponent } from './fix-interview-date/fix-interview-date.component';
import { ProposeInterviewDateComponent } from './propose-interview-date/propose-interview-date.component';
import { ConfigurationFromsComponent } from './configuration-froms/configuration-froms.component';
import { CandidateInformationComponent } from './candidate-information/candidate-information.component';
import { CreateTaskComponent } from './popup/create-task/create-task.component';
import { ShowTasksPopupComponent } from './popup/show-tasks-popup/show-tasks-popup.component';
import { CandidateResponsesComponent } from './candidate-responses/candidate-responses.component';
import { CreateDocumentComponent } from './communications/create-document/create-document.component';
import { EditDocumentComponent } from './communications/edit-document/edit-document.component';


@NgModule({
    imports: [
        CommonModule,
        RouterModule,
        MatDialogModule,
        FormsModule,
        CKEditorModule,
        DragulaModule.forRoot(),
        CalendarModule.forRoot({
            provide: DateAdapter,
            useFactory: adapterFactory
        }),
        NgbModule
    ],
    declarations: [HeaderComponent,
        SvgSpiritComponent,
        HomeComponent,
        FooterComponent,
        NavComponent,
        DashboardComponent,
        DeveloperHomeComponent,
        DeveloperCreateFormComponent,
        DeveloperEditFormComponent,
        FormfillingComponent,
        UserComponent,
        PermissionComponent,
        NewPermissionComponent,
        AddUserPopupComponent,
        DocumentsComponent,
        AddModelComponent,
        ModelsComponent,
        EditModelComponent,
        AdmissionsComponent,
        ResidentsComponent,
        CandidateDetailsComponent,
        CandidateEntreviewComponent,
        ConfigurationComponent,
        DeleteAlertPopupComponent,
        CalendarComponent,
        DiscardChangesPopupComponent,
        FixInterviewDateComponent,
        ProposeInterviewDateComponent,
        ConfigurationFromsComponent,
        CandidateInformationComponent,
        CreateTaskComponent,
        ShowTasksPopupComponent,
        CandidateResponsesComponent,
        CreateDocumentComponent,
        EditDocumentComponent,
        
    ],
    exports: [AddUserPopupComponent, DeleteAlertPopupComponent , DiscardChangesPopupComponent , CreateTaskComponent , ShowTasksPopupComponent ],
    entryComponents: [AddUserPopupComponent, DeleteAlertPopupComponent , DiscardChangesPopupComponent , CreateTaskComponent , ShowTasksPopupComponent ]
})
export class DashboardModule { }

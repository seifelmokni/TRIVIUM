import { BrowserModule } from '@angular/platform-browser';

import { AngularFirestoreModule } from 'angularfire2/firestore';
import { AngularFireModule } from 'angularfire2';
import { AppComponent } from './app.component';
import { RoutingModule } from './routing/routing.module';
import { HomeModule } from './home/home.module';
import { environment } from '../environments/environment';
import { DashboardModule } from './dashboard/dashboard.module';
import { FormsService } from './shared/forms/forms.service';
import { AuthService } from './shared/auth/auth.service';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ModelsService } from './shared/models/models.service';
import { CandidateService } from './shared/candidate/candidate.service';

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    RoutingModule,
    DashboardModule,
    HomeModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule,
    BrowserAnimationsModule,
    ],
  providers: [FormsService , AuthService , ModelsService , CandidateService],
  bootstrap: [AppComponent]
})
export class AppModule { }

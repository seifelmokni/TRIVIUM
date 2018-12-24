import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AngularFirestoreModule } from 'angularfire2/firestore';
import { AngularFireModule } from 'angularfire2';
import { AppComponent } from './app.component';
import { RoutingModule } from './routing/routing.module';
import { HomeModule } from './home/home.module';
import { environment } from '../environments/environment';
import { DashboardModule } from './dashboard/dashboard.module';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    RoutingModule,
    DashboardModule,
    HomeModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

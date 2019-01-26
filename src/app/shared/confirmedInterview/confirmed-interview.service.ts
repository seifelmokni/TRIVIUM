import { Injectable } from '@angular/core';
import { Confirmerinterview } from 'src/app/models/confirmedInterview/confirmerinterview.model';
import { AngularFirestore } from 'angularfire2/firestore';

@Injectable({
  providedIn: 'root'
})
export class ConfirmedInterviewService {

  constructor(private db: AngularFirestore) { }


  saveInterview(c: Confirmerinterview){
    return this.db.collection('confirmed-interviews').add(c);
  }
}

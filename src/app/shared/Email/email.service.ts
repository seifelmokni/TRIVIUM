import { Injectable } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';
import { Email } from '../../models/Email/email.model';

@Injectable({
  providedIn: 'root'
})
export class EmailService {

  constructor(private db: AngularFirestore) { }

  sendEmail(email: Email){
    return this.db.collection('messages').add(email);
  }
}

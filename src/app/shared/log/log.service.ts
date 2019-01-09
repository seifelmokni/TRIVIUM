import { Injectable } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';
import * as firebase from 'firebase';

@Injectable({
    providedIn: 'root'
})
export class LogService {

    constructor(private db: AngularFirestore) { }

    logAction(user: string, actionType: string, actionValue: string, timestamp: string) {
        this.db.collection('logs').add({
            user: user,
            action: actionType,
            value: actionValue ,
            timestamp : firebase.firestore.FieldValue.serverTimestamp()
        });
    }

}

import { Injectable } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';
import * as firebase from 'firebase';
import { CandidateLog } from 'src/app/models/candidateLog/candidate-log.model';

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

    saveCandidateLog(log: CandidateLog){
       return this.db.collection('candidte-logs').add(log)  ; 
    }

    listCandidateLogs(candidateId:string){
       return  this.db.collection(
            'candidte-logs',
            (ref) => ref.where('logCandidateId' , '==' , candidateId)
        ).snapshotChanges().map(
            actions => {
                return actions.map(
                    a => {
                        const data = a.payload.doc.data() as CandidateLog;
                        data.logId = a.payload.doc.id;
                        return data;
                    }
                );
            }
        );
    }

}

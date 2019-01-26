import { Injectable } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';
import { Response } from '../../models/response/response.model';

@Injectable({
    providedIn: 'root'
})
export class ResponseService {

    constructor(private db: AngularFirestore) { }

    saveResponse(response: Response) {
        return this.db.collection('response').add(response);
    }

    listResponse() {
       return this.db.collection('response').snapshotChanges().map(
            actions => {
                return actions.map(
                    a => {

                        const data = a.payload.doc.data() as Response;
                        console.log('data');
                        console.log(a);
                        data.responseID = a.payload.doc.id;
                        console.log(data);
                        return data;
                    }
                );
            }
        );
    }

    listCandidateResponse(candidateId:string) {
        return this.db.collection('response' , ref => ref.where('candidateId' , '==' , candidateId)).snapshotChanges().map(
             actions => {
                 return actions.map(
                     a => {
 
                         const data = a.payload.doc.data() as Response;
                         console.log('data');
                         console.log(a);
                         data.responseID = a.payload.doc.id;
                         console.log(data);
                         return data;
                     }
                 );
             }
         );
     }
}

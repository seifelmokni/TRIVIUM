import { Injectable } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';
import { Collection } from '../../models/collection/collection.model';
import { InterviewConfig } from '../../models/interview-config.model';

@Injectable({
    providedIn: 'root'
})
export class ConfigurationService {

    constructor(private db: AngularFirestore) { }

    saveCollection(c: Collection) {
        return this.db.collection('collections').add(c);
    }

    listCollection() {
        return this.db.collection('collections').snapshotChanges().map(
            actions => {
                return actions.map(
                    a => {

                        const data = a.payload.doc.data() as Collection;
                        console.log('data');
                        console.log(a);
                        data.colectionId = a.payload.doc.id;
                        console.log(data);
                        return data;
                    }
                );
            }
        );
    }



    updateCollection(c: Collection) {
        return this.db.doc('collections/' + c.colectionId).update(c);
    }

    listInterViewConfigurtaion() {
        return this.db.collection('interview-config').snapshotChanges().map(
            actions => {
                return actions.map(
                    a => {

                        const data = a.payload.doc.data() as InterviewConfig;
                        console.log('data');
                        console.log(a);
                        data.configId = a.payload.doc.id;
                        console.log(data);
                        return data;
                    }
                );
            }
        );
    }
    saveInterViewConfiguration(interviewConfig : InterviewConfig) {
      if(interviewConfig.configId === '' || interviewConfig.configId === undefined ){
         return this.db.collection('interview-config').add(interviewConfig);
      }else{
         return this.db.doc('interview-config/'+interviewConfig.configId).update(interviewConfig);
      }

    }
}

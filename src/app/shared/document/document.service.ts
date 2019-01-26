import { Injectable } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';
import { Document } from 'src/app/models/documents/document.model';

@Injectable({
  providedIn: 'root'
})
export class DocumentService {

  documentSelected:Document ; 

  constructor(private db:AngularFirestore) { }

  listDocuments(){
    return this.db.collection('documents').snapshotChanges().map(
      actions => {
          return actions.map(
              a => {

                  const data = a.payload.doc.data() as Document;
                  data.documentId = a.payload.doc.id;
                  return data;
              }
          );
      }
  );
  }

  saveDocument(d:Document){
    return this.db.collection('documents').add(d);
  }
  updateDocument(d:Document){
    return this.db.doc('documents/'+d.documentId).update(d);
  }
}

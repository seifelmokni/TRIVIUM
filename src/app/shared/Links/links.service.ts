import { Injectable } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';
import { Links } from 'src/app/models/links/links.model';

@Injectable({
  providedIn: 'root'
})
export class LinksService {

  constructor(private db: AngularFirestore) { }

  save(l:Links){
    if(l.id != '' && l.id != undefined){
     return  this.db.doc('links/'+l.id).update(l) ; 
    }else{
      return this.db.collection('links').add(l) ; 
    }
  }

  delete(l:Links){
    return this.db.doc('links/'+l.id).delete() ; 
  }

  list(){
    return this.db.collection('links').snapshotChanges().map(
      actions => {
          return actions.map(
              a => {
                  const data = a.payload.doc.data() as Links;
                  console.log('data');
                  console.log(a);
                  data.id = a.payload.doc.id;
                  console.log(data);
                  return data;
              }
          );
      }
  );
  }
}

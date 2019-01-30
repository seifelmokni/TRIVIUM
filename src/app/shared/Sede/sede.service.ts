import { Injectable } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';
import { Sede } from 'src/app/models/sede/sede.model';

@Injectable({
  providedIn: 'root'
})
export class SedeService {

  constructor(private db: AngularFirestore) { }
  list(){
    return this.db.collection('sede').snapshotChanges().map(
      actions => {
          return actions.map(
              a => {

                  const data = a.payload.doc.data() as Sede;
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

  saveSede(sede:Sede){
    if(sede.id != undefined){
    return  this.db.doc('sede/'+sede.id).update(sede) ; 
    }else{
    return  this.db.collection('sede').add(sede) ; 
    }
  }
}

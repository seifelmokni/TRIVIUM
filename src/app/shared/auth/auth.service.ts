import { Injectable } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private db: AngularFirestore) { }

  login(email: string , password: string ) {

     this.db.collection('/users').valueChanges();

  }


}

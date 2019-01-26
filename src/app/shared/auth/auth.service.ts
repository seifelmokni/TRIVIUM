import { Injectable } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';
import { Observable } from 'rxjs';
import { User } from '../../models/user/user.model';

@Injectable({
    providedIn: 'root'
})
export class AuthService {

    userSession: User;

    user: Observable<User[]>;

    constructor(private db: AngularFirestore) { }

    login(email: string, password: string) {
        console.log('login auth service');
        return this.db.collection('users',
            ref => ref.where('login', '==', email).where('password', '==', password))
            .snapshotChanges().map(
                actions => {
                    return actions.map(
                        a => {
                            const data = a.payload.doc.data() as User;
                            data.userID = a.payload.doc.id;
                            this.userSession =data;
                            return data;
                        }
                    );
                }
            );
    }
    setUserSession(user: User) {
        this.userSession = user;
    }
    destroyUserSession() {
        this.userSession = null;
    }
    getUserSession() {
        return this.userSession !== undefined ? this.userSession : new User('', '', '', '');
    }

    addUser(user: User) {
        return this.db.collection('users').add(user);
    }
    updateUser(user: User) {
        return this.db.doc('users/'+user.userID).update(user);
    }

    list() {
        return this.db.collection('users').snapshotChanges().map(
            actions => {
                return actions.map(
                    a => {
                        const data = a.payload.doc.data() as User;
                        data.userID = a.payload.doc.id;
                        return data;
                    }
                );
            }
        );
    }

    delete(user: User) {
        const id = user.userID;
        console.log('delete id ' + id);
        this.db.doc('users/' + id).delete();
    }


}

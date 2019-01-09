import { Injectable } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';
import { of, Observable } from 'rxjs';
import { Permission } from '../../models/permission/permission.model';

@Injectable({
    providedIn: 'root'
})
export class PermissionService {

    constructor(private db: AngularFirestore) { }

    list() {
        return this.db.collection('permissions').snapshotChanges().map(
            actions => {
                return actions.map(
                    a => {

                        const data = a.payload.doc.data() as Permission;
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

    addPermission(p: Permission) {
       return this.db.collection('permissions').add(p);
    }
}

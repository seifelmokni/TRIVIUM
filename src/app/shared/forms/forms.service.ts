import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import { Form } from '../../models/form/form.model';

@Injectable({
    providedIn: 'root'
})
export class FormsService {
    private formCollection: AngularFirestoreCollection<Form>;

    constructor(private db: AngularFirestore) { }

    persist(form: Form) {
        this.formCollection = this.db.collection<Form>('forms');
        this.formCollection.add(form);


    }
}

import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import { Form } from '../../models/form/form.model';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class FormsService {
    private formCollection: AngularFirestoreCollection<Form>;

    private selectedForm: Form;



    constructor(private db: AngularFirestore) { }

    listForms(): Observable<{}[]> {
        return this.db.collection('forms').snapshotChanges().map(
            actions => {
                return actions.map(
                    a => {

                        const data = a.payload.doc.data() as Form;
                        console.log('data');
                        console.log(a);
                        data.formId = a.payload.doc.id;
                        console.log(data);
                        return data;
                    }
                );
            }
        );
    }

    persist(form: Form) {
        return this.db.collection('forms').add(form);
    }

    getSelectedForm(): Form {
        return this.selectedForm;
    }
    setSelectedForm(f: Form) {
        this.selectedForm = f;
    }
}

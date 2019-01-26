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

    update(form: Form) {
        return this.db.doc('forms/' + form.formId).update(form);
    }
    delete(form: Form) {
        return this.db.doc('forms/' + form.formId).delete();
    }

    getForm(formId:string){
        return this.db.collection('forms' , ref => ref.where('formId' , '==' , formId)).snapshotChanges().map(
            actions => {
                return actions.map(
                    a => {
                        const data = a.payload.doc.data() as Form;
                        console.log('data');
                        console.log(a);
                        data.formId = a.payload.doc.id;
                        for(let i =  0 ; i < data.pages.length ; i++){
                            if(data.pages[i].pageSaved == undefined){
                                console.log('page is saved') ; 
                                data.pages[i].pageSaved = true ; 
                            }
                        }
                        console.log(data);
                        return data;
                    }
                );
            }
        );
    }

    getSelectedForm(): Form {
        return this.selectedForm;
    }
    setSelectedForm(f: Form) {
        this.selectedForm = f;
    }
}

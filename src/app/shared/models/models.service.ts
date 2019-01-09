import { Injectable } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';
import { Model } from '../../models/model/model.model';

@Injectable({
    providedIn: 'root'
})
export class ModelsService {

    selectedModel: Model;

    constructor(private db: AngularFirestore) { }

    saveModel(model: Model) {
        return this.db.collection('models').add(model);
    }

    updateModel(model: Model) {
        return this.db.doc('models/' + model.modelId).update(model);
    }

    listModels() {
        return this.db.collection('models').snapshotChanges().map(
            actions => {
                return actions.map(
                    a => {

                        const data = a.payload.doc.data() as Model;
                        console.log('data');
                        console.log(a);
                        data.modelId = a.payload.doc.id;
                        console.log(data);
                        return data;
                    }
                );
            }
        );

    }
}

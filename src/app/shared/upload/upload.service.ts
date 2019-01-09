import { Injectable } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';
import { Upload } from '../../models/upload/upload.model';
import * as firebase from 'firebase/app';
import 'firebase/storage';


@Injectable({
    providedIn: 'root'
})
export class UploadService {

    private basePath = '/uploads';
    urls: Array<string>;

    constructor(private af: AngularFirestore) { }

    pushUpload(upload: Upload) {
        this.urls = [];
        const storageRef = firebase.storage().ref();
        return storageRef.child(this.basePath + '/' + upload.file.name).put(upload.file);
    }

    private saveFileData(upload: Upload) {
        this.af.collection('files').add(upload);
    }
}

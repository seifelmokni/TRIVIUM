import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { Router } from '@angular/router';
import { ChangeEvent } from '@ckeditor/ckeditor5-angular/ckeditor.component';
import { Upload } from '../../../models/upload/upload.model';
import { UploadService } from '../../../shared/upload/upload.service';
import { Model } from '../../../models/model/model.model';
import * as firebase from 'firebase/app';
import 'firebase/storage';
import { ModelsService } from '../../../shared/models/models.service';
import { AuthService } from '../../../shared/auth/auth.service';

@Component({
  selector: 'app-edit-model',
  templateUrl: './edit-model.component.html',
  styleUrls: ['./edit-model.component.css']
})
export class EditModelComponent implements OnInit {

    public editor = ClassicEditor;
    modelName;
    modelDescription;
    modelSubject;
    modelMetaData;
    modelFiles;
    modelContent;

    @ViewChild('metaDataSelector') metaDataSelector: ElementRef;
    selectedFiles: FileList;
    currentUpload: Upload;
    urls: Array<string>;

    model: Model;


    constructor(private router: Router,
        private uploadService: UploadService,
        private modelService: ModelsService,
        private authService: AuthService) {

            this.model = this.modelService.selectedModel;

        }

    ngOnInit() {
        console.log('model');
        console.log(this.model);
    }

    cancel() {

        this.router.navigate(['/models']);

    }
    preview() {

    }

    editorChange({ editor }: ChangeEvent) {
        this.modelContent = editor.getData();
    }
    detectFiles(event) {
        this.selectedFiles = event.target.files;
    }


    save() {
        this.modelMetaData = this.metaDataSelector.nativeElement.options[this.metaDataSelector.nativeElement.selectedIndex].value;
        console.log('model inputs');
        console.log(this.modelName);
        console.log(this.modelSubject);
        console.log(this.modelDescription);
        console.log(this.modelMetaData);
        console.log(this.modelContent);
        this.model.name = this.modelName;
        this.model.subject = this.modelSubject;
        this.model.description = this.modelDescription;
        this.model.metaData = this.modelMetaData;
        this.model.content = this.modelContent;
        this.model.creatorID = this.authService.getUserSession().userID;
        let uploadIndex = 0;
        this.urls = [];
        if (this.selectedFiles !== undefined) {
            for (let i = 0; i < this.selectedFiles.length; i++) {
                const upload = new Upload(this.selectedFiles[i]);
                const uploadTask = this.uploadService.pushUpload(upload);
                uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED, (snapshot) => {
                    // upload progresss
                    // upload.progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    // console.log('uploading ' + uploadIndex + ' ' + upload.progress);
                },
                    (error) => {
                        // upload error
                        console.log('error ' + uploadIndex);
                        console.log(error);
                    },
                    () => {
                        upload.url = uploadTask.snapshot.downloadURL;
                        this.urls.push(upload.url);
                        upload.name = upload.file.name;
                        console.log('upad completed ' + uploadIndex);
                        uploadIndex++;
                        if (uploadIndex === this.selectedFiles.length) {
                            this.model.files = this.urls;
                            this.modelService.updateModel(this.model).then(() => { this.cancel(); });
                        }
                    }
                );
            }
        } else {
            this.model.files = [];
            this.modelService.updateModel(this.model).then(() => { this.cancel(); });
        }




    }

}

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
import { FormsService } from 'src/app/shared/forms/forms.service';
import { Form } from 'src/app/models/form/form.model';
import { PlatformLocation } from '@angular/common';
import { CKEditor5 } from '@ckeditor/ckeditor5-angular/ckeditor';
import { Sede } from 'src/app/models/sede/sede.model';
import { SedeService } from 'src/app/shared/Sede/sede.service';
import { Document } from 'src/app/models/documents/document.model';
import { DocumentService } from 'src/app/shared/document/document.service';

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
    ckEditor;
    showRowDropdown = false ; 
    showFieldsDropdown = false; 


    column = '';
    row= '';
    sede: Sede = new Sede();
    @ViewChild('metaDataSelector') metaDataSelector: ElementRef;
    @ViewChild('columnSelector') columnSelector: ElementRef;
    @ViewChild('rowSelector') rowSelector: ElementRef;
    @ViewChild('fieldSelector') fieldSelector: ElementRef;
    @ViewChild('documentSelector') documentSelector: ElementRef;
    elements:Array<{page:number , id:number , title:string}> = [] ;
    selectedElements:Array<{page:number , id:number , title:string}> = [] ;
 
    selectedFiles: FileList;
    currentUpload: Upload;
    urls: Array<string>;

    model: Model;
    forms : Form[] = [] ; 
    documents : Document[] = [];


    constructor(private router: Router,
        private uploadService: UploadService,
        private modelService: ModelsService,
        private authService: AuthService,
        private formService: FormsService,
        private sedeService: SedeService,
        private documentService: DocumentService ,
        private plateformLocation: PlatformLocation) {

            this.model = this.modelService.selectedModel;
            if(this.model.metaFields != undefined){
                this.selectedElements = this.model.metaFields ; 
            }

        }

    ngOnInit() {
        console.log('model');
        console.log(this.model);
        this.formService.listForms().subscribe(
            (fs: Form[]) =>{
                console.log("forms") ; 
                console.log(fs);
                this.forms = fs;
            }
        );
        this.sedeService.list().subscribe(
            (sedes: Sede[]) => {
              if(sedes.length != 0){
                this.sede = sedes[0] ; 
              }
            }
          );
          this.documentService.listDocuments().subscribe(
              (d:Document[]) => {
                  this.documents = d ; 
              }
          );
    }

    documentSelected(){

        const id = this.documentSelector.nativeElement.options[this.documentSelector.nativeElement.selectedIndex].value ; 
        if(id != '-1'){
            this.model.documentId = id ; 
        }

    }

    cancel() {

        this.router.navigate(['/models']);

    }
    preview() {

    }
    columSelect(){
        const v  = this.columnSelector.nativeElement.options[this.columnSelector.nativeElement.selectedIndex].value ; 
        if(v != '0'){
            this.column = v ; 
        }else{
            this.column = '' ; 
        }
    }

    rowSelect(){
        const r =this.rowSelector.nativeElement.options[this.rowSelector.nativeElement.selectedIndex].value ; 
        console.log('row selected');
        console.log(r);
        console.log(this.column+'----'+r);

        if(r != '0'){

        const insertElement = '[BTS-'+this.sede.columns.indexOf(this.column)+'-'+this.sede.rows.indexOf(r)+']' ; 
        this.ckEditor.setData(this.ckEditor.getData().replace(new RegExp('</p>'+'$') , insertElement ));

        }else{

        }
    }
    fieldSelect(){
        const elementIndex = this.fieldSelector.nativeElement.options[this.fieldSelector.nativeElement.selectedIndex].value ; 
        const el = this.elements[elementIndex];
        console.log('element selected') ; 
        console.log(el);
        this.selectedElements.push(el);
        const insertElement = '[BTF-'+this.selectedElements.indexOf(el)+']';
        this.ckEditor.setData(this.ckEditor.getData().replace(new RegExp('</p>'+'$') , insertElement ));

    }
    insertMetaData(){
        const meta = this.metaDataSelector.nativeElement.options[this.metaDataSelector.nativeElement.selectedIndex].value ;
        let insertElement = '' ; 
        switch (meta){
            case 'email' : {
                this.showFieldsDropdown = false; 
                this.showRowDropdown = false; 
                insertElement = '[BTEMAIL]';
                this.ckEditor.setData(this.ckEditor.getData().replace(new RegExp('</p>'+'$') , insertElement ));
                break;
            }
            case 'name' : {
                this.showFieldsDropdown = false; 
                this.showRowDropdown = false; 
                insertElement = '[BTNAME]';
                this.ckEditor.setData(this.ckEditor.getData().replace(new RegExp('</p>'+'$') , insertElement ));
                break;
            }
            case 'passwordLink' : {
                this.showFieldsDropdown = false; 
                this.showRowDropdown = false; 
                insertElement = '[BTPASSWORDLINK]';
                this.ckEditor.setData(this.ckEditor.getData().replace(new RegExp('</p>'+'$') , insertElement ));
                break;
            }
            case 'securityToken' : {
                this.showFieldsDropdown = false; 
                this.showRowDropdown = false; 
                insertElement = '[BTSECURITYTOKEN]';
                this.ckEditor.setData(this.ckEditor.getData().replace(new RegExp('</p>'+'$') , insertElement ));
                break;
            }
            case '0' : {

                break; 
            }
            default : {
                //insert form 
                if(meta.split('=')[0] == 'f' ){
                    console.log('form case') ; 
                    const formid= meta.split('=')[1] ; 
                    for(let i = 0 ; i < this.forms.length ; i++){
                        if(this.forms[i].formId == formid){
                            const f = this.forms[i] ; 
                            for(let j= 0 ; j < f.pages.length ; j++){
                                const page  = f.pages[j] ; 
                                for(let k = 0 ; k < page.formComposition.length ; k++){
                                    if(page.formComposition[k].type != 'white_space'
                                    && page.formComposition[k].type != 'photo'
                                    &&page.formComposition[k].type != 'video'
                                    &&page.formComposition[k].type != 'youtube'
                                    &&page.formComposition[k].type != 'single_line'
                                    &&page.formComposition[k].type != 'section'
                                    &&page.formComposition[k].type != 'header'
                                    &&page.formComposition[k].type != 'title'
                                    &&page.formComposition[k].type != 'paragraph'){
                                    const el = {page: j , id:k ,title: page.formComposition[k].labelTitle } ;
                                    this.elements.push(el) ; 
                                    }
                                }
                            }
                            break;
                        }
                    }
                    
                    
                    this.showFieldsDropdown = true; 
                    this.showRowDropdown = false; 


                }else{
                    console.log('column case');
                    this.showFieldsDropdown = false; 
                    this.showRowDropdown = true; 
                    this.column = meta.split('=')[1] ; 
                }
                /*
                console.log('location');
                console.log((this.plateformLocation as any).location);
                console.log((this.plateformLocation as any).location.href);
                console.log((this.plateformLocation as any).location.origin);
                const url = (this.plateformLocation as any).location.origin+'/fillCandidature/'+meta+'/[BTCANDIDATEID]' ;
                console.log(url);
                insertElement = url; */
               
            }
        }
        
        
    }
    editorReady(editor: CKEditor5.Editor){
        console.log('editor ready setting data');
        console.log(editor);
        //editor.setData('test data') ; 
        this.ckEditor = editor;
        
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
        this.model.metaFields = this.selectedElements; 
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

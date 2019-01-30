import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { DocumentService } from 'src/app/shared/document/document.service';
import { Router } from '@angular/router';
import { Document } from 'src/app/models/documents/document.model';
import { CKEditor5 } from '@ckeditor/ckeditor5-angular/ckeditor';
import { ChangeEvent } from '@ckeditor/ckeditor5-angular/ckeditor.component';
import { AuthService } from 'src/app/shared/auth/auth.service';
import { Sede } from 'src/app/models/sede/sede.model';
import { Form } from 'src/app/models/form/form.model';
import { FormsService } from 'src/app/shared/forms/forms.service';
import { PlatformLocation } from '@angular/common';
import { SedeService } from 'src/app/shared/Sede/sede.service';

@Component({
  selector: 'app-edit-document',
  templateUrl: './edit-document.component.html',
  styleUrls: ['./edit-document.component.css']
})
export class EditDocumentComponent implements OnInit {
  public editor = ClassicEditor;
  document:Document;
  ckEditor;
  htmlData = '';
  documentTemplate;
  documentDescription;
  documentName;
  showRowDropdown = false ; 
  showFieldsDropdown = false; 
  elements:Array<{page:number , id:number , title:string}> = [] ;
  selectedElements:Array<{page:number , id:number , title:string}> = [] ;
  column = '';
  row= '';
  forms: Form[] = [] ;    
  sede: Sede = new Sede();

  @ViewChild('metaDataSelector') metaDataSelector: ElementRef;
  @ViewChild('columnSelector') columnSelector: ElementRef;
  @ViewChild('rowSelector') rowSelector: ElementRef;
  @ViewChild('fieldSelector') fieldSelector: ElementRef;  
  
  constructor(private documentService: DocumentService ,
     private router:Router ,
      private authService:AuthService,
      private formService: FormsService,
      private plateformLocation: PlatformLocation,
      private elementRef: ElementRef,
      private sedeService: SedeService) { }

  ngOnInit() {
    this.document = this.documentService.documentSelected 
    this.documentName = this.document.documentName ; 
    this.documentDescription = this.document.documentDescription;
    this.documentTemplate = this.document.documentTemplate;
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
  }
  save(){
    this.document.documentName = this.documentName ; 
    this.document.documentDescription = this.documentDescription ; 
    this.document.documentTemplate = this.ckEditor.getData();
    this.document.createdBy = this.authService.getUserSession();
    this.document.metaFields = this.selectedElements ; 

    this.documentService.updateDocument(this.document).then(
      () => {
        this.router.navigate(['documents']);
      }
    );


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
    this.ckEditor = editor;
    
}

editorChange({ editor }: ChangeEvent) {
    this.documentTemplate = editor.getData();
}

}

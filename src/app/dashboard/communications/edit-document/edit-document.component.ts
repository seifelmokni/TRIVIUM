import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { DocumentService } from 'src/app/shared/document/document.service';
import { Router } from '@angular/router';
import { Document } from 'src/app/models/documents/document.model';
import { CKEditor5 } from '@ckeditor/ckeditor5-angular/ckeditor';
import { ChangeEvent } from '@ckeditor/ckeditor5-angular/ckeditor.component';
import { AuthService } from 'src/app/shared/auth/auth.service';

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

  @ViewChild('metaDataSelector') metaDataSelector: ElementRef;
    
  
  constructor(private documentService: DocumentService , private router:Router , private authService:AuthService) { }

  ngOnInit() {
    this.document = this.documentService.documentSelected 
    this.documentName = this.document.documentName ; 
    this.documentDescription = this.document.documentDescription;
    this.documentTemplate = this.document.documentTemplate;
  }
  save(){
    this.document.documentName = this.documentName ; 
    this.document.documentDescription = this.documentDescription ; 
    this.document.documentTemplate = this.ckEditor.getData();
    this.document.createdBy = this.authService.getUserSession();
    this.documentService.updateDocument(this.document).then(
      () => {
        this.router.navigate(['documents']);
      }
    );


  }
  insertMetaData(){
    const meta = this.metaDataSelector.nativeElement.options[this.metaDataSelector.nativeElement.selectedIndex].value ;
    let insertElement = '' ; 
    switch (meta){
        case 'email' : {
            insertElement = '[BTEMAIL]';
            break;
        }
        case 'name' : {
            insertElement = '[BTNAME]';
            break;
        }
        case 'passwordLink' : {
            insertElement = '[BTPASSWORDLINK]';
            break;
        }
        case 'securityToken' : {
            insertElement = '[BTSECURITYTOKEN]';
            break;
        }
        case '0' : {

            break; 
        }
        default : {
            //insert form 
           
        }
    }
    this.ckEditor.setData(this.ckEditor.getData().replace(new RegExp('</p>'+'$') , insertElement ));
    
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

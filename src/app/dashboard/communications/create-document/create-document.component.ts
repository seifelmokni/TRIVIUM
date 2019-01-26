import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { CKEditor5 } from '@ckeditor/ckeditor5-angular/ckeditor';
import { ChangeEvent } from '@ckeditor/ckeditor5-angular/ckeditor.component';
import { Document } from 'src/app/models/documents/document.model';
import { DocumentService } from 'src/app/shared/document/document.service';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/shared/auth/auth.service';

@Component({
  selector: 'app-create-document',
  templateUrl: './create-document.component.html',
  styleUrls: ['./create-document.component.css']
})
export class CreateDocumentComponent implements OnInit {
  public editor = ClassicEditor;
  ckEditor;
  htmlData = '';
  documentTemplate;
  documentDescription;
  documentName;

  @ViewChild('metaDataSelector') metaDataSelector: ElementRef;
    
  
  constructor(private documentService: DocumentService , private router:Router , private authService:AuthService) { }

  ngOnInit() {
  }
  save(){
    const document = new Document();
    document.documentName = this.documentName ; 
    document.documentDescription = this.documentDescription ; 
    document.documentTemplate = this.ckEditor.getData();
    document.createdBy = this.authService.getUserSession();
    this.documentService.saveDocument(document).then(
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

import { Component, OnInit } from '@angular/core';
import { DocumentService } from 'src/app/shared/document/document.service';
import { Document } from 'src/app/models/documents/document.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-documents',
  templateUrl: './documents.component.html',
  styleUrls: ['./documents.component.css']
})
export class DocumentsComponent implements OnInit {
  documents: Document[];
  constructor(private documentService:DocumentService, private router: Router) { }

  ngOnInit() {

    this.documentService.listDocuments().subscribe(
      (d:Document[]) => {
        this.documents = d ; 
      }
    );
  }

  editDocument(d:Document){
    this.documentService.documentSelected = d ;
    this.router.navigate(['editDocument'])
  }
  deleteDocument(d:Document){
    this.documentService.deleteDocument(d.documentId);
  }

}

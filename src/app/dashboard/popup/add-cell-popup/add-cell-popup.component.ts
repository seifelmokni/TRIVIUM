import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-add-cell-popup',
  templateUrl: './add-cell-popup.component.html',
  styleUrls: ['./add-cell-popup.component.css']
})
export class AddCellPopupComponent implements OnInit {
  message;
  value = '';
  content= '' ;

  constructor(
      public dialogRef: MatDialogRef<AddCellPopupComponent>,
      @Inject(MAT_DIALOG_DATA) public data: { message: string , content:string }) {
      this.message = data.message;
      this.content = data.content ; 
  }


  ngOnInit() {
      console.log(this.message);
  }
  onNoClick(): void {
      this.dialogRef.close();
  }

}

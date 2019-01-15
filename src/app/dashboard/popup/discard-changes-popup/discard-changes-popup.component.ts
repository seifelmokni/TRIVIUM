import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-discard-changes-popup',
  templateUrl: './discard-changes-popup.component.html',
  styleUrls: ['./discard-changes-popup.component.css']
})
export class DiscardChangesPopupComponent implements OnInit {
  message;
  confirm = true;

  constructor(
      public dialogRef: MatDialogRef<DiscardChangesPopupComponent>,
      @Inject(MAT_DIALOG_DATA) public data: { message: string }) {
      this.message = data.message;
  }


  ngOnInit() {
      console.log('pop up delete');
      console.log(this.message);
  }
  onNoClick(): void {
      this.confirm = false;
      this.dialogRef.close();

  }

}

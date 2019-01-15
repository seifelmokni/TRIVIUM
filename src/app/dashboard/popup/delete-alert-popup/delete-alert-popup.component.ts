import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-delete-alert-popup',
  templateUrl: './delete-alert-popup.component.html',
  styleUrls: ['./delete-alert-popup.component.css']
})
export class DeleteAlertPopupComponent implements OnInit {
    message;
    confirm = true;

    constructor(
        public dialogRef: MatDialogRef<DeleteAlertPopupComponent>,
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

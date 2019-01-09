import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { User } from '../../../models/user/user.model';

@Component({
    selector: 'app-add-user-popup',
    templateUrl: './add-user-popup.component.html',
    styleUrls: ['./add-user-popup.component.css']
})
export class AddUserPopupComponent implements OnInit {

    user: User;

    constructor(
        public dialogRef: MatDialogRef<AddUserPopupComponent>,
        @Inject(MAT_DIALOG_DATA) public data: { user: User }) {
        this.user = data.user;
    }


    ngOnInit() {


        console.log('pop up add user');
        console.log(this.user);
    }
    onNoClick(): void {
        this.dialogRef.close();

    }

}

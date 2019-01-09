import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { MatDialog } from '@angular/material';
import { AddUserPopupComponent } from '../popup/add-user-popup/add-user-popup.component';
import { AuthService } from '../../shared/auth/auth.service';
import { User } from '../../models/user/user.model';

@Component({
    selector: 'app-user',
    templateUrl: './user.component.html',
    styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {

    @ViewChild('searchUserInput') searchUserInput: ElementRef;

    users: User[];
    originalUsers: User[];
    selectedUserID = '';
    selectedUser: User;
    constructor(public dialog: MatDialog, private authservice: AuthService) { }

    ngOnInit() {
        this.authservice.list().subscribe(
            (usrs: User[]) => {
                console.log('Users');
                console.log(usrs);
                this.users = usrs;
                this.originalUsers = usrs;
            }
        );
    }

    openDialog(): void {
        const dialogRef = this.dialog.open(AddUserPopupComponent, {
            width: '300px',
            data: { user: new User('', '', '', '') }
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result.login !== '') {

                console.log('The dialog was closed');
                console.log(result);
                this.authservice.addUser(result).then(data => {
                    console.log('adding user result');
                    console.log(data);
                });

            }

        });
    }

    selectUser(user: User) {
        console.log('select user');
        console.log(user);
        this.selectedUserID = user.userID;
        this.selectedUser = user;
    }

    editUser() {
        const dialogRef = this.dialog.open(AddUserPopupComponent, {
            width: '300px',
            data: { user: this.selectUser }
        });
    }

    deleteUser() {
        this.authservice.delete(this.selectedUser);
    }

    filter() {
                this.users = [];

        console.log('filter');
        console.log(this.searchUserInput.nativeElement.value);
        if (this.searchUserInput.nativeElement.value.length > 0) {
            this.users = this.originalUsers.filter(
                el =>
                el.firstName.indexOf(this.searchUserInput.nativeElement.value) !== -1
                || el.lastName.indexOf(this.searchUserInput.nativeElement.value) !== -1
                || el.login.indexOf(this.searchUserInput.nativeElement.value) !== -1
            );
        } else {
            this.users = this.originalUsers;
        }



    }

    cancelFilter() {
        console.log('cancel filter');
            this.users = this.originalUsers;
    }

}

import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Permission } from '../../models/permission/permission.model';
import { PermissionService } from '../../shared/permissions/permission.service';
import { AuthService } from '../../shared/auth/auth.service';
import { Router } from '@angular/router';

@Component({
    selector: 'app-new-permission',
    templateUrl: './new-permission.component.html',
    styleUrls: ['./new-permission.component.css']
})
export class NewPermissionComponent implements OnInit {

    permission: Permission;

    dev: Boolean = false;
    welcome: Boolean = false;
    addmission: Boolean = false;
    resident: Boolean = false;
    user: Boolean = false;
    communication: Boolean = false;

    @ViewChild('profileName') profileName: ElementRef;
    @ViewChild('description') description: ElementRef;
    @ViewChild('showInUserList') showInUserList: ElementRef;
    @ViewChild('isSuperAdmin') isSuperAdmin: ElementRef;

    constructor(private permissionService: PermissionService,
        private authService: AuthService,
        private router: Router) { }

    ngOnInit() {
        this.permission = new Permission('', '', '', [], false, false);
    }

    activateAccess(access) {
        console.log('activate access ' + access);
        if (!this.isAccesActiv(1, access)) {
            const p = { permissionName: access, view: true, create: false, edit: false, delete: false };
            this.permission.access.push(p);

            switch (access) {
                case 'dev': {
                    console.log('activate dev');
                    this.dev = true;
                    break;
                }
                case 'welcome': {
                    this.welcome = true;
                    break;
                }
                case 'admission': {
                    this.addmission = true;
                    break;
                }
                case 'resident': {
                    this.resident = true;
                    break;
                }
                case 'user': {
                    this.user = true;
                    break;
                }
                case 'communication': {
                    this.communication = true;
                    break;
                }
            }
        } else {
            let index = -1;
            for (let i = 0; i < this.permission.access.length; i++) {
                const p = this.permission.access[i];
                if (p.permissionName === access) {
                    index = i;
                    break;
                }
            }
            if (index !== -1) {
                this.permission.access.splice(index, 1);
            }
            switch (access) {
                case 'dev': {
                    console.log('activate dev');
                    this.dev = false;
                    break;
                }
                case 'welcome': {
                    this.welcome = false;
                    break;
                }
                case 'admission': {
                    this.addmission = false;
                    break;
                }
                case 'resident': {
                    this.resident = false;
                    break;
                }
                case 'user': {
                    this.user = false;
                    break;
                }
                case 'communication': {
                    this.communication = false;
                    break;
                }
            }
        }
    }


    changeAccessPermission(value) {


    }

    isAccesActiv(index, access): Boolean {
        for (let i = 0; i < this.permission.access.length; i++) {
            const p = this.permission.access[i];
            if (p.permissionName === access) {
                return true;
            }
        }
        return false;
    }

    savePermission() {

        this.permission.profileName = this.profileName.nativeElement.value;
        this.permission.description = this.description.nativeElement.innerText;
        this.permission.isSuperAdmin = this.isSuperAdmin.nativeElement.checked;
        this.permission.showInUserList = this.showInUserList.nativeElement.checked;
        this.permission.userId = this.authService.getUserSession().userID;

        console.log('permission');
        console.log(this.permission);

        this.permissionService.addPermission(this.permission).then(
            () => {
                this.router.navigate(['permission']);
            }
        );

    }

}

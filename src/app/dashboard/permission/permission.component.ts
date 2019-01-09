import { Component, OnInit } from '@angular/core';
import { Permission } from '../../models/permission/permission.model';
import { PermissionService } from '../../shared/permissions/permission.service';

@Component({
    selector: 'app-permission',
    templateUrl: './permission.component.html',
    styleUrls: ['./permission.component.css']
})
export class PermissionComponent implements OnInit {

    permissions: Array<Permission>;

    constructor(private permissionService: PermissionService) { }

    ngOnInit() {

        this.permissionService.list().subscribe(
            (permissions: Permission[]) => {
                console.log(permissions);
                this.permissions = permissions;
            });
    }

}

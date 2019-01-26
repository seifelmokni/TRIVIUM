import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/shared/auth/auth.service';
import { User } from 'src/app/models/user/user.model';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
    user:User;
    constructor(private router: Router , private authService:AuthService) { }

    ngOnInit() {
        this.user = this.authService.getUserSession() ; 
    }

    logout() {
        this.router.navigate(['']);
    }

}

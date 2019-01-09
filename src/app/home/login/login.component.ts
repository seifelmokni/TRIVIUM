import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../shared/auth/auth.service';
import { User } from '../../models/user/user.model';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

    loginForm: FormGroup;

    constructor(private formBuilder: FormBuilder, private router: Router, private authService: AuthService) { }

    ngOnInit() {

        this.loginForm = this.formBuilder.group({
            user_email: ['', [Validators.required, Validators.email]],
            user_password: ['', Validators.required]
        });
    }


    login() {

        console.log('forms value');
        console.log(this.loginForm.get('user_email').value);
        console.log(this.loginForm.get('user_password').value);

        this.authService.login(this.loginForm.get('user_email').value,
            this.loginForm.get('user_password').value).subscribe(
                (users: User[]) => {
                    console.log('users');
                    console.log(users);
                    if (users.length === 1) {
                        this.router.navigate(['/dashboard']);
                        this.authService.setUserSession(users[0]);
                    }


                }
            );

    }

}

import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

 loginForm: FormGroup;

  constructor(private formBuilder: FormBuilder, private router: Router) { }

  ngOnInit() {

    this.loginForm = this.formBuilder.group({
        user_email: ['' , [Validators.required , Validators.email]],
        user_password: ['' , Validators.required]
    });
  }


  login() {

    console.log('forms value') ;
    console.log(this.loginForm.get('user_email').value) ;
    console.log(this.loginForm.get('user_password').value) ;

    this.router.navigate(['/dashboard']);


  }

}

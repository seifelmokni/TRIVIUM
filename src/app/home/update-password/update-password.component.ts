import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/models/user/user.model';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/shared/auth/auth.service';

@Component({
  selector: 'app-update-password',
  templateUrl: './update-password.component.html',
  styleUrls: ['./update-password.component.css']
})
export class UpdatePasswordComponent implements OnInit {
  confirmpassword;
  password;
  user: User

  constructor(private route: ActivatedRoute,
     private authService: AuthService,
     private router: Router) { }

  ngOnInit() {
    this.route.params.subscribe(
      params => {
        const usrId= params['userID'];
        if(usrId != undefined){
          this.authService.list().subscribe(
            (users: User[]) => {
              for(let i = 0 ; i < users.length ; i++){
                if(users[i].userID == usrId){
                  this.user = users[i] ; 
                }
              }
            }
          );
        }else{
          this.router.navigate(['/']);
        }
        
      }
    );
  }
  submit(){
    if(this.confirmpassword == this.password){
      this.user.password = this.password ; 
      this.authService.updateUser(this.user).then(
        () => {
          this.router.navigate(['updatesuccess']);
        }
      ) ; 
    }
  }

}

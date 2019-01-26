import { Component, OnInit, Inject, ViewChild, ElementRef } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { Task } from 'src/app/models/tasks/task.model';
import { AuthService } from 'src/app/shared/auth/auth.service';
import { User } from 'src/app/models/user/user.model';

@Component({
  selector: 'app-create-task',
  templateUrl: './create-task.component.html',
  styleUrls: ['./create-task.component.css']
})
export class CreateTaskComponent implements  OnInit {

  task: Task;
  isReassign= false;
  users: User[];

  @ViewChild('userSelector') userSelector:ElementRef;
  @ViewChild('typeSelector') typeSelector:ElementRef; 
  constructor(
      public dialogRef: MatDialogRef<CreateTaskComponent>,
      @Inject(MAT_DIALOG_DATA) public data: {task: Task}, private authService: AuthService) {
        if(data.task == null){
          this.task = new Task();
          this.task.taskContent = '';  
        }else{
          this.task = new Task();
          this.task.assignedTo = data.task.assignedTo;
          this.task.taskContent = data.task.taskContent;
          this.task.sendEmail = data.task.sendEmail;
          this.task.candidateID = data.task.candidateID;
          this.isReassign = true;
        }
        console.log('users ng oninit')
    this.authService.list().subscribe(
      (users: User[]) => {
        this.users = users ; 
        console.log('users') ; 
        console.log(users);
      }
    );
        
  }


  ngOnInit() {
    
  }

  selectType(){
    console.log('user selected') ; 
    let u = this.typeSelector.nativeElement.options[this.typeSelector.nativeElement.selectedIndex].value;
    if(u != '-1'){
      this.task.taskType = u;
    }
  }


  selectUser(){

    console.log('user selected') ; 
    let u = this.userSelector.nativeElement.options[this.userSelector.nativeElement.selectedIndex].value;
    if(u != '-1'){
      this.task.assignedTo = this.users[u];
    }

  }
  onNoClick(): void {
      this.dialogRef.close();

  }

}

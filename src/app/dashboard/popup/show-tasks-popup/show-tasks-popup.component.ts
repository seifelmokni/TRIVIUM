import { Component, OnInit, ViewChild, Inject, ElementRef } from '@angular/core';
import { Task } from 'src/app/models/tasks/task.model';
import { User } from 'src/app/models/user/user.model';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { AuthService } from 'src/app/shared/auth/auth.service';
import { TaskService } from 'src/app/shared/task/task.service';

@Component({
  selector: 'app-show-tasks-popup',
  templateUrl: './show-tasks-popup.component.html',
  styleUrls: ['./show-tasks-popup.component.css']
})
export class ShowTasksPopupComponent implements   OnInit {

  tasks: Task[];
  isReassign= false;
  users: User[];
  selectedTask : Task;

  @ViewChild('userSelector') userSelector:ElementRef; 
  constructor(
      public dialogRef: MatDialogRef<ShowTasksPopupComponent>,
      @Inject(MAT_DIALOG_DATA) public data: {tasks: Task[]},
       private authService: AuthService , 
       private elementRef: ElementRef,
       private taskService: TaskService) {
        this.tasks = data.tasks ; 
        
  }


  ngOnInit() {
    this.authService.list().subscribe(
      (users: User[]) => {
        this.users = users ; 
      }
    )
  }

  selectTask(t:Task){
    this.selectedTask = t ; 
  }

  sendMessage(i:number , t: Task){
    console.log('send message '+i) ;
    console.log(t);
    const textArea = this.elementRef.nativeElement.querySelector('#msg-'+i) ; 
    console.log('message is');
    console.log(textArea.value);
    const msg  = {author:this.authService.getUserSession().firstName+' '+this.authService.getUserSession().lastName
    ,  message:textArea.value
    , timeStamp:(new Date().getFullYear())+'-'+(new Date().getMonth()+1)+'-'+(new Date().getDate())+" "+(new Date().getHours())+':'+(new Date().getMinutes()) };
    if(t.conversation == undefined){
      t.conversation = [] ; 
    }
    t.conversation.push(msg) ; 
    t.sendEmail = true ; 
    this.taskService.updateTask(t).then(
      () => {
        this.dialogRef.close();
      }
    ); 

  }

  showResponseBox(i){
    this.elementRef.nativeElement.querySelector('#resp-'+i).style = "display:grid";
    this.elementRef.nativeElement.querySelector('#resp-btn-'+i).style = 'display:inherit';
    this.elementRef.nativeElement.querySelector('#resp-action-'+i).style = 'display:none';
  }


  onNoClick(): void {
      this.dialogRef.close();

  }

}


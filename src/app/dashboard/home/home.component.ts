import { Component, OnInit, ViewChild, ElementRef, Renderer2 } from '@angular/core';
import { CandidateService } from 'src/app/shared/candidate/candidate.service';
import { InterviewDateService } from 'src/app/shared/interviewDate/interview-date.service';
import { Candidate } from 'src/app/models/candidate/candidate.model';
import { Interview } from 'src/app/models/interview/interview.model';
import { User } from 'src/app/models/user/user.model';
import { AuthService } from 'src/app/shared/auth/auth.service';
import { Router } from '@angular/router';
import { CandidateLog } from 'src/app/models/candidateLog/candidate-log.model';
import { LogService } from 'src/app/shared/log/log.service';
import { TaskService } from 'src/app/shared/task/task.service';
import { Task } from 'src/app/models/tasks/task.model';
import { MatDialog } from '@angular/material';
import { ShowTasksPopupComponent } from '../popup/show-tasks-popup/show-tasks-popup.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  @ViewChild('userSelector') userSelector: ElementRef;
  activeUser:User;
  candidates: Candidate[];
  eventsData: Array<{candidate : Candidate , interview : Interview}> = [];
  interviews: Interview[];
  users: User[];
  tasks: Map<string , Task[]> = new Map();
  textAreaShown = '' ; 
  constructor(private candidateService: CandidateService ,
    private interViewService: InterviewDateService,
    private authService: AuthService,
    private router: Router,
    private logSerivce: LogService,
    private taskService: TaskService,
    private dialog: MatDialog,
    private elementRef: ElementRef,
    private renderer: Renderer2
    ) { }

  ngOnInit() {
    this.activeUser = this.authService.getUserSession(); 
    if(this.activeUser == undefined){
      this.activeUser = new User('' , '' ,'' , '');
    }
    console.log('active user');
    console.log(this.activeUser);
    this.candidateService.listAdmissionCandidate().subscribe(
      (candidates: Candidate[]) => {
          console.log('candidates');
          console.log(candidates);
          this.candidates = [] ;
          for(let i = 0 ; i< candidates.length ; i++){
            if(candidates[i].status != 'resident'){
              this.candidates.push(candidates[i]);
              this.taskService.listTask(candidates[i].candidateId).subscribe(
                (t:Task[]) => {
                  this.tasks.set(candidates[i].candidateId , t);
                }
              );
            }
          }

          
          
         // this.candidates = candidates;
      }
  );
  this.authService.list().subscribe(
    (usrs:User[]) => {
      this.users = usrs ; 
    }
  );
  }
  showTasks(tasks: Task[]){
    const dialogRef = this.dialog.open(ShowTasksPopupComponent, {
      width: '50px',
      data: {tasks: tasks  }
  });

  dialogRef.afterClosed().subscribe(result => {
      if (result !== '') {
          console.log('The dialog was closed');
          console.log(result);
      }
  });
  }


  showObservationTextArea(id){
    console.log('id') ; 
    console.log(id);
    this.textAreaShown = 'txt-'+id ; 
  }

  saveObservation(id){
    const textAreaId= '#txtarea-'+id ; 
    const textArea = this.elementRef.nativeElement.querySelector(textAreaId) ; 
    console.log('ob') ; 
    console.log(textArea.value); 
    this.textAreaShown = '' ; 
    for(let i = 0 ; i < this.candidates.length ; i++){
      if(this.candidates[i].candidateId == id){
        const ob = {ob : textArea.value , author: this.authService.getUserSession().firstName+' '+this.authService.getUserSession().firstName}
        if(this.candidates[i].observations == undefined){
          this.candidates[i].observations = [] ; 
        }
        this.candidates[i].observations.push(ob) ; 
        this.candidateService.updateCandidate(this.candidates[i]) ; 
        break; 
        
      }
    }
  }


  assignUser(candidate: Candidate , event){
      console.log('assign user changed') ; 
      console.log(candidate) ; 
      console.log(event.srcElement.selectedIndex) ;
      console.log(event.srcElement.options[event.srcElement.selectedIndex].value) ; 
      candidate.userInChage = event.srcElement.options[event.srcElement.selectedIndex].value ;
      candidate.status = 'pending-interview';
      this.candidateService.updateCandidate(candidate).then(
        () => {
          const candidateLog = new CandidateLog();
          candidateLog.logCandidateId = candidate.candidateId ; 
          candidateLog.logType = 'assing-user';
          this.logSerivce.saveCandidateLog(candidateLog) ; 
        }
      ) ; 

  }

  showDetails(candidate: Candidate) {
    this.candidateService.selectedCandidate = candidate;
    this.router.navigate(['fixInterviewDate']);
}
}

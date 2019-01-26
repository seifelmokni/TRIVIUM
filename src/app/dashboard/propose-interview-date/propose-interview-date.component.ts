import { Component, OnInit } from '@angular/core';
import { Candidate } from 'src/app/models/candidate/candidate.model';
import { CandidateService } from 'src/app/shared/candidate/candidate.service';
import { AuthService } from 'src/app/shared/auth/auth.service';
import { User } from 'src/app/models/user/user.model';
import { Router } from '@angular/router';
import { Confirmerinterview } from 'src/app/models/confirmedInterview/confirmerinterview.model';
import { ConfirmedInterviewService } from 'src/app/shared/confirmedInterview/confirmed-interview.service';
import { LogService } from 'src/app/shared/log/log.service';
import { CandidateLog } from 'src/app/models/candidateLog/candidate-log.model';

@Component({
  selector: 'app-propose-interview-date',
  templateUrl: './propose-interview-date.component.html',
  styleUrls: ['./propose-interview-date.component.css']
})
export class ProposeInterviewDateComponent implements OnInit {
  candidate: Candidate;
  admissionCandidate: Candidate[];
  users: User[];
  interviewDate:string;
  interviewHour:string="8:30";
  emailText:string;
  constructor(private candidateService: CandidateService ,
     private authService: AuthService,
     private router: Router,
     private confirmedInterviewSerivce: ConfirmedInterviewService ,
     private logSerivce: LogService) { }

  ngOnInit() {
    this.candidate = this.candidateService.selectedCandidate ; 
    this.candidateService.listAdmissionCandidate().subscribe(
      (c:Candidate[]) => {
        this.admissionCandidate = c ; 
      }
    );
    this.authService.list().subscribe(
      (usrs: User[]) => {
        this.users = usrs; 
      }
    );
  }

  changeCandidate(c: Candidate){
    this.candidateService.selectedCandidate=c ; 
    this.router.navigate(['fixInterviewDate']);

  }

  confirmInterview(){
    console.log('confirm interview') ; 
    console.log(this.interviewDate);
    console.log(this.interviewHour) ; 
    console.log(this.emailText) ; 
    const interview = new Confirmerinterview();
    interview.date = this.interviewDate;
    interview.time = this.interviewHour ; 
    interview.candidateId = this.candidate.candidateId ; 
    interview.createdAt = new Date().toString();
    interview.joinedText = this.emailText;

    this.confirmedInterviewSerivce.saveInterview(interview).then(
      (docRef) => {
        this.candidate.confirmedInterviewId = docRef.id ; 
        this.candidate.status = "Interview Fixed" ; 
        this.candidateService.updateCandidate(this.candidate).then(
          () => {
            const candidateLog = new CandidateLog();
            candidateLog.logCandidateId = this.candidate.candidateId ; 
            candidateLog.logType = 'interview-fixed' ; 
            this.logSerivce.saveCandidateLog(candidateLog).then(
              () => {
                this.router.navigate(['dashboard']);
              }
            );
            
          }
        );
      }
    );

  }

}

import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CandidateService } from 'src/app/shared/candidate/candidate.service';
import { InterviewDateService } from 'src/app/shared/interviewDate/interview-date.service';
import { Router } from '@angular/router';
import { Candidate } from 'src/app/models/candidate/candidate.model';
import { AuthService } from 'src/app/shared/auth/auth.service';
import { User } from 'src/app/models/user/user.model';
import { Interview } from 'src/app/models/interview/interview.model';
import { Confirmerinterview } from 'src/app/models/confirmedInterview/confirmerinterview.model';
import { CandidateLog } from 'src/app/models/candidateLog/candidate-log.model';
import { LogService } from 'src/app/shared/log/log.service';
import { ConfirmedInterviewService } from 'src/app/shared/confirmedInterview/confirmed-interview.service';

@Component({
  selector: 'app-fix-interview-date',
  templateUrl: './fix-interview-date.component.html',
  styleUrls: ['./fix-interview-date.component.css']
})
export class FixInterviewDateComponent implements OnInit {

  candidate: Candidate;
  admissionCandidate: Candidate[] ; 
  users: User[] ; 
  interviewDates: Interview[] ; 
  interviewHour = '' ; 
  interviewDate = '' ;
  textAreaShown = false ; 
  @ViewChild('interviewDateSelector') interviewDateSelector: ElementRef ;
  @ViewChild('observationTextArea') observationTextArea: ElementRef ;  
  

  constructor(private candidateService: CandidateService , 
    private interviewSerivce: InterviewDateService,
    private authService: AuthService,
    private router: Router,
    private logSerivce: LogService,
    private confirmedInterviewSerivce: ConfirmedInterviewService
    ) { }

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
    this.interviewSerivce.listInterviewForCandidate(this.candidate.candidateId).subscribe(
      (its:Interview[]) => {
        this.interviewDates =its;
        for(let i = 0; i < this.interviewDates.length ; i++){
          this.interviewDates[i].interviewDate = this.interviewDates[i].interviewDate.split('00:00')[0];
        }
      }
    );

  }

  showObservationTextArea(){
    this.textAreaShown = true ;
  }
  saveObservation(){
    console.log('ob') ; 
    console.log(this.observationTextArea.nativeElement.value); 
    const v = this.observationTextArea.nativeElement.value;
    const ob = {ob : v , 
      author: this.authService.getUserSession().firstName+' '+this.authService.getUserSession().firstName,
      date: (new Date().getDate())+"-"+(new Date().getMonth() +1)+"-"+(new Date().getFullYear()) , 
      hour: (new Date()).getHours()+":"+(new Date().getMinutes() < 10  ?  '0'+(new Date().getMinutes()) : new Date().getMinutes())
    }
        if(this.candidate.observations == undefined){
          this.candidate.observations = [] ; 
        }
        this.candidate.observations.push(ob) ; 
        this.candidateService.updateCandidate(this.candidate) ; 
        

    this.textAreaShown = false ; 


  }

  goBackAction(){
    this.router.navigate(['dashboard']) ; 
  }

  showHour(){
    const index = this.interviewDateSelector.nativeElement.options[this.interviewDateSelector.nativeElement.selectedIndex].value ; 
    console.log('index '+index) ; 
    if(index != -1){
      const interview= this.interviewDates[index] ; 
      console.log(interview) ; 
      this.interviewDate = interview.interviewDate;
      this.interviewHour = interview.interviewStartHour+':'+(interview.interviewStartMinute != 0 ? interview.interviewStartMinute : '00');
    }
  }

  proposeNewInterviewDate(){
    this.router.navigate(['proposenewinterviewdate']) ; 
  }

  changeCandidate(c:Candidate){
    
    this.candidateService.selectedCandidate=c;
    this.candidate = c; 
  }

  showInformationLog(){
    this.router.navigate(['information']);
  }

  fixThisDate(){
    const interview = new Confirmerinterview();
    interview.date = this.interviewDate;
    interview.time = this.interviewHour ; 
    interview.candidateId = this.candidate.candidateId ; 
    interview.createdAt = new Date().toString();
    interview.joinedText = '';

    this.confirmedInterviewSerivce.saveInterview(interview).then(
      (docRef) => {
        this.candidate.confirmedInterviewId = docRef.id ; 
        this.candidate.status = "Interview Fixed" ; 
        this.candidateService.updateCandidate(this.candidate).then(
          () => {
            const candidateLog = new CandidateLog();
            candidateLog.logCandidateId = this.candidate.candidateId ; 
            candidateLog.logType = 'interview-accepted' ; 
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

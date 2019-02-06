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
import { Model } from 'src/app/models/model/model.model';
import { ModelsService } from 'src/app/shared/models/models.service';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { CKEditor5 } from '@ckeditor/ckeditor5-angular/ckeditor';
import { Sede } from 'src/app/models/sede/sede.model';
import { SedeService } from 'src/app/shared/Sede/sede.service';
import { Email } from 'src/app/models/Email/email.model';
import { EmailService } from 'src/app/shared/Email/email.service';


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
  sendEmail = 0 ; 
  models: Model[] = [];
  subject= '';
  selectedModel: Model ;
  public editor = ClassicEditor;
  ckEditor; 
  sede: Sede ; 
  observations:Array<{ob:string , author:string , date:string , hour:string}> = [];
  @ViewChild('interviewDateSelector') interviewDateSelector: ElementRef ;
  @ViewChild('observationTextArea') observationTextArea: ElementRef ;  
  @ViewChild('modelSelector') modelSelector: ElementRef ;  
  

  constructor(private candidateService: CandidateService , 
    private interviewSerivce: InterviewDateService,
    private authService: AuthService,
    private router: Router,
    private logSerivce: LogService,
    private modelService: ModelsService ,
    private sedeService: SedeService,
    private emailSerivce: EmailService,
    private confirmedInterviewSerivce: ConfirmedInterviewService
    ) { }

  ngOnInit() {
    this.candidate = this.candidateService.selectedCandidate ;
    if(this.candidate.observations.length != 0){
      this.observations = [this.candidate.observations[this.candidate.observations.length-1]]; 
    }
    console.log('observation') ; 
    console.log(this.observations);
    this.sedeService.list().subscribe(
      (s:Sede[]) => {
        if(s.length != 0){
          this.sede = s[0] ; 
        }
      }
    );
    this.modelService.listModels().subscribe(
      (m:Model[]) => {
        this.models = m ;
      }
    );
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

  modelChanged(){
    const i = this.modelSelector.nativeElement.options[this.modelSelector.nativeElement.selectedIndex].value ; 
    if(i != '-1'){
      this.selectedModel = this.models[i] ; 
      let html = this.selectedModel.content ; 
      console.log(this.selectedModel) ; 
      html = html.replace(/\[BTNAME\]/g , this.candidate.firstName+' '+this.candidate.lastName) ; 
      html = html.replace(/\[BTEMAIL\]/g , this.candidate.email) ; 
      const sedeFields = html.match(/\[BTS\-[0-9]\-[0-9]\]/gm) ; 
      console.log('sede fields') ; 
      console.log(sedeFields) ; 
      if(this.sede != undefined){

        for(let j = 0 ; j < sedeFields.length ; j++){
          let s = sedeFields[j]
          s = s.replace(/\[/g , '') ; 
          s = s.replace(/\]/g , '') ; 
          const column = s.split('-')[1] ; 
          const row = s.split('-')[2] ; 
          const key = column+'----'+row ;
          console.log('key '+key) ; 
          for(let k = 0 ; k < this.sede.table.length ; k++){
            console.log('key sede '+this.sede.table[k].key) ; 
            if(this.sede.table[k].key == key){
              console.log('found') ; 
              html = html.replace(sedeFields[j] , this.sede.table[k].value );
            }
          }
        }
      }
      html = html.replace(/\[BTF\-[0-9]\]/g , '') ;
      this.ckEditor.setData(html);
      this.subject =this.selectedModel.subject ; 
    }
  }
  editorReady(editor: CKEditor5.Editor){
    console.log('editor ready setting data');
    console.log(editor);
    this.ckEditor = editor;
    
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
      date: (new Date().getDate())+"-"+(new Date().getMonth() < 10 ? '0'+(new Date().getMonth() +1) : new Date().getMonth() +1)+"-"+(new Date().getFullYear()) , 
      hour: (new Date()).getHours()+":"+(new Date().getMinutes() < 10  ?  '0'+(new Date().getMinutes()) : new Date().getMinutes())
    }
        if(this.candidate.observations == undefined){
          this.candidate.observations = [] ; 
        }
        this.candidate.observations.push(ob) ; 
        this.candidateService.updateCandidate(this.candidate).then(
          () => {
            if(this.candidate.observations.length != 0){
              this.observations = [this.candidate.observations[this.candidate.observations.length-1]]; 
            }
          }
        ) ; 
        

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
                if(this.sendEmail == 1){
                  console.log('sending an email') ; 
                  const email = new Email() ; 
                  email.email = this.candidate.email ; 
                  email.subject = this.subject ; 
                  email.html = this.ckEditor.getData();
                  email.name = this.candidate.firstName +' '+ this.candidate.lastName ; 
                  this.emailSerivce.sendEmail(email).then(
                    () => {
                      this.router.navigate(['dashboard']);
                    }
                  ) ; 
                }else{
                  this.router.navigate(['dashboard']);
              
                }
              
              }
            );
            
          }
        );
      }
    );
  }

}

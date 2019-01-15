import { Component, OnInit } from '@angular/core';
import { CandidateService } from 'src/app/shared/candidate/candidate.service';
import { InterviewDateService } from 'src/app/shared/interviewDate/interview-date.service';
import { Candidate } from 'src/app/models/candidate/candidate.model';
import { Interview } from 'src/app/models/interview/interview.model';
import { User } from 'src/app/models/user/user.model';
import { AuthService } from 'src/app/shared/auth/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  candidates: Candidate[];
  eventsData: Array<{candidate : Candidate , interview : Interview}> = [];
  interviews: Interview[];
  users: User[];

  constructor(private candidateService: CandidateService ,
    private interViewService: InterviewDateService,
    private authService: AuthService
    ) { }

  ngOnInit() {

    this.candidateService.listCandidate().subscribe(
      (candidates: Candidate[]) => {
          console.log('candidates');
          console.log(candidates);
          this.candidates = candidates;
          this.interViewService.listAllInterview().subscribe(
              (interviews: Interview[]) => {
                  console.log('interviews ');
                  console.log(interviews);
                  this.handleInterviews(interviews);
              }
          );
      }
  );
  this.authService.list().subscribe(
    (usrs:User[]) => {
      this.users = usrs ; 
    }
  );
  }

  handleInterviews(interviews: Interview[]){
    this.eventsData = [] ;
    this.interviews = interviews;
    for(let i = 0 ; i < interviews.length ; i++){
        console.log('interview ');
        console.log(interviews[i]);
        let candidate: Candidate;
        const interview: Interview = interviews[i];
        for(let j = 0 ; j< this.candidates.length ; j++){
            if(this.candidates[j].candidateId === interview.interviewCandidateId){
                candidate = this.candidates[j];
                break;
            }
        }

        this.eventsData.push({
            candidate : candidate , interview : interview
        });
    }
    console.log('events');
    console.log(this.eventsData);
}


}

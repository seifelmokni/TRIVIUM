import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { Candidate } from '../../models/candidate/candidate.model';
import { CandidateService } from '../../shared/candidate/candidate.service';
import { ResponseService } from '../../shared/response/response.service';
import { Router } from '@angular/router';
import { Email } from 'src/app/models/Email/email.model';
import { EmailService } from 'src/app/shared/Email/email.service';

@Component({
    selector: 'app-candidate-details',
    templateUrl: './candidate-details.component.html',
    styleUrls: ['./candidate-details.component.css']
})
export class CandidateDetailsComponent implements OnInit {
    candidate: Candidate;
    candidateList: Candidate[];
    @ViewChild('statusSelector') statusSelector: ElementRef;
    @ViewChild('prioritySelector') prioritySelector: ElementRef;
    messageContent = '';
    constructor(private candidateSerivce: CandidateService,
        private responseService: ResponseService,
        private router: Router,
        private emailService: EmailService) { }

    ngOnInit() {
        this.candidate = this.candidateSerivce.selectedCandidate;
        this.candidateSerivce.listCandidate().subscribe(
            (c: Candidate[]) => {
                this.candidateList = c;
                this.candidateList = [];
                this.candidateList.push(this.candidate);
                for (let i = 0; i < c.length; i++) {
                    if (c[i].candidateId !== this.candidate.candidateId) {
                        this.candidateList.push(c[i]);
                    }
                }
            }
        );
    }

    loadCandidateDetails(candidate: Candidate) {
        this.candidateSerivce.selectedCandidate = candidate;
        this.router.navigate(['candidateDetails']);
    }

    sendMessage() {
        console.log('upddating');
        this.candidate.status =
            this.statusSelector.nativeElement.options[this.statusSelector.nativeElement.selectedIndex].value;
        this.candidate.priority =
            this.prioritySelector.nativeElement.options[this.prioritySelector.nativeElement.selectedIndex].value;
            this.candidateSerivce.updateCandidate(this.candidate).then(
                () => {
                    console.log('update done');
                    if(this.messageContent.length != 0){
                        const email = new Email();
                        email.message = this.messageContent; 
                        email.email = this.candidate.email;
                        email.html = '<p>'+this.messageContent+'</p>';
                        email.subject= 'Message from Balagua TRIVIUM';

                        this.emailService.sendEmail(email).then(
                            () => {
                                this.goBack();
                            }
                        )
                    }else{
                        this.goBack();
                    }
                }
            );
    }

    showLogInformation(){
        this.router.navigate(['information']);
    }
    goBack() {
        this.router.navigate(['admissions']);
    }
}

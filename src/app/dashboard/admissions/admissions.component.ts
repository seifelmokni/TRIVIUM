import { Component, OnInit } from '@angular/core';
import { Response } from '../../models/response/response.model';
import { ResponseService } from '../../shared/response/response.service';
import { Candidate } from '../../models/candidate/candidate.model';
import { CandidateService } from '../../shared/candidate/candidate.service';
import { Router } from '@angular/router';

@Component({
    selector: 'app-admissions',
    templateUrl: './admissions.component.html',
    styleUrls: ['./admissions.component.css']
})
export class AdmissionsComponent implements OnInit {

    responses: Response[];
    candidates: Candidate[];
    constructor(private responseService: ResponseService,
        private candidateSerivce: CandidateService,
        private router: Router) { }

    ngOnInit() {
        // this.responseService.listResponse().subscribe(
        //     (r: Response[]) => {
        //         this.responses = r;
        //     }
        // );
        this.candidateSerivce.listCandidate().subscribe(
            (candidates: Candidate[]) => {
                this.candidates = candidates;
            }
        );
    }

    showDetails(candidate: Candidate) {
        this.candidateSerivce.selectedCandidate = candidate;
        this.router.navigate(['candidateDetails']);


    }

}

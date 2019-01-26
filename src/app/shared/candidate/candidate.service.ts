import { Injectable } from '@angular/core';
import { Candidate } from '../../models/candidate/candidate.model';
import { AngularFirestore } from 'angularfire2/firestore';

@Injectable({
    providedIn: 'root'
})
export class CandidateService {

    selectedCandidate: Candidate;

    constructor(private db: AngularFirestore) { }

    saveCandidate(candidate: Candidate) {
        return this.db.collection('candidate').add(candidate);
    }

    listCandidate() {
        return this.db.collection('candidate').snapshotChanges().map(
            actions => {
                return actions.map(
                    a => {

                        const data = a.payload.doc.data() as Candidate;
                        console.log('data');
                        console.log(a);
                        data.candidateId = a.payload.doc.id;
                        console.log(data);
                        return data;
                    }
                );
            }
        );
    }

    listAdmissionCandidate() {
        return this.db.collection('candidate').snapshotChanges().map(
            actions => {
                return actions.map(
                    a => {

                        const data = a.payload.doc.data() as Candidate;
                        console.log('data');
                        console.log(a);
                        data.candidateId = a.payload.doc.id;
                        console.log(data);
                        return data;
                    }
                );
            }
        );
    }

    updateCandidate(candidate: Candidate) {
        return this.db.doc('candidate/' + candidate.candidateId ).update(candidate);
    }
}

import { Injectable } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';
import { Interview } from 'src/app/models/interview/interview.model';

@Injectable({
  providedIn: 'root'
})
export class InterviewDateService {

  constructor(private db: AngularFirestore) { }

  listInterviewForCandidate(candidateID:string){
      return this.db.collection('interviews' , 
      (ref) => ref.where('interviewCandidateId' , '==' , candidateID)
      ).snapshotChanges().map(
        actions => {
            return actions.map(
                a => {
                    const data = a.payload.doc.data() as Interview;
                    data.interviewId = a.payload.doc.id;
                    return data;
                }
            );
        }
    );
  }

  listAllInterview(){
    return this.db.collection('interviews').snapshotChanges().map(
      actions => {
          return actions.map(
              a => {
                  const data = a.payload.doc.data() as Interview;
                  data.interviewId = a.payload.doc.id;
                  return data;
              }
          );
      }
  );
  }

  listUpCommingInterView(){
    return this.db.collection('interviews' , 
    ref => ref.where('interviewDate' ,'>=' , new Date())
    ).snapshotChanges().map(
      actions => {
          return actions.map(
              a => {
                  const data = a.payload.doc.data() as Interview;
                  data.interviewId = a.payload.doc.id;
                  return data;
              }
          );
      }
  );
  }

  saveInterview(interview: Interview){
      return this.db.collection('interviews').add(interview);
  }

  
}

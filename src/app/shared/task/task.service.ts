import { Injectable } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';
import { Task } from 'src/app/models/tasks/task.model';

@Injectable({
  providedIn: 'root'
})
export class TaskService {

  constructor(private db:AngularFirestore) { }

  saveTask(task:Task){
    return this.db.collection('tasks').add(task);
  }

  listTask(candidateID:string){
    return this.db.collection('tasks' , ref => ref.where('candidateID','==' , candidateID)).snapshotChanges().map(
      actions => {
          return actions.map(
              a => {
                  const data = a.payload.doc.data() as Task;
                  console.log('data');
                  console.log(a);
                  data.taskId = a.payload.doc.id;
                  console.log(data);
                  return data;
              }
          );
      }
  );
  }
  updateTask(t:Task){
    return this.db.doc('tasks/'+t.taskId).update(t);

  }
}

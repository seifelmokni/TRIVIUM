import { User } from "../user/user.model";

export class Task extends Object {
    taskId:string='';
    taskContent:string='';
    assignedTo:User;
    sendEmail:Boolean = true;
    createdAt:string = (new Date().getFullYear())+'-'+(new Date().getMonth()+1)+'-'+(new Date().getDate())+" "+(new Date().getHours())+':'+(new Date().getMinutes());
    assigner:User;
    candidateID:string='';
    isClosed:Boolean = false;
    taskType: string = '' ; 
    conversation:Array<{author:string , message:string , timeStamp:string}> = [] ; 
    description:string =''; 
    

    constructor(){
        super();
    }

}

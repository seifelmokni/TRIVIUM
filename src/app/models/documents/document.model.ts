import { User } from "../user/user.model";

export class Document extends Object {
    documentId:string ;
    documentName:string = ''; 
    documentTemplate:string = '' ; 
    documentDescription:string = '';
    createdBy:User ; 
    constructor(){
        super();
    }
}

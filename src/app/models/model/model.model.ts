export class Model extends Object {

    modelId: string;
    name: string;
    description: string;
    subject: string;
    content: string;
    files: Array<string>;
    metaData: string;
    documentId:string ; 
    createdAt: Date = new Date();
    creatorID: string;
    metaFields:Array<{page:number , id:number , title:string}> =[];
    constructor() {
        super();
    }
}

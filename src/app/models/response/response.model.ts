export class Response extends Object {
    response: Array<{ label: string, value: string, type: string, pageIndex: number, responseIndex: number }>;
    formId: string;
    creationDate: Date = new Date();
    responseID: string;
    candidateId: string;


    constructor() {
        super();
        this.response = [];
    }
}

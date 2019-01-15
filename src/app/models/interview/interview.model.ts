export class Interview extends Object {
    interviewId:string;
    interviewCandidateId:string
    interviewDate: string ;
    interviewStartHour: number;
    interviewStartMinute: number;
    interviewEndHour: number;
    interviewEndMinute: number;
    confirmed: Boolean = false;
    choiceIndex: number;
    constructor() {
        super();
    }
}

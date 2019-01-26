export class CandidateLog extends Object {
    logId:string;
    logDate:string = (new Date().getFullYear())+'-'+(new Date().getMonth()+1)+'-'+(new Date().getDate());
    logHour:string = (new Date().getHours())+':'+(new Date().getMinutes());
    logCandidateId:string;
    logType:string;
    logContent:string;
    constructor(){
        super();
    }

}

export class Candidate extends Object {
    status: string = '';
    priority: string = '';
    phase: string = '';
    firstName: string = '';
    secondName: string = '';
    lastName: string = '';
    college: string = '';
    phone: string = '';
    fixPhone:string = '';
    email: string = '';
    emailUnav: string = '';
    image: string  = '';


    // to get more info
    step:string='';
    fatherName:string = '';
    fatherFirstName:string = '';
    fatherNationality:string = '';
    motherName:string = ''
    motherFirstName:string = '';
    motherNationality:string = ''
    addressType:string = '';
    roadType:string = '';
    number:string = '';
    country:string = '';
    province:string = '';
    population:string = '';
    hq:string = '';
    birthDate:string = '';
    nationality:string = '';
    secondEmail:string = '';
    dni:string = '';
    region:string = '';
    city:string = '';
    //to get more info

    candidateId:string;
    applicationDate: string;
    userInChage: string;
    isFirstRequest: boolean = true;
    confirmedInterviewId:string;
    observations:Array<{ob:string , author:string , date:string , hour:string}> = [];
    personalObservation:string= '' ; 
    academicObservation:string= '' ; 
    economicObservation:string= '' ; 
    education: Array<{id:string , averageGrade: string , province:string , population:string, center:string}> =[];


    constructor() {
        super();
    }
}

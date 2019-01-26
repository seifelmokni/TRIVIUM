export class InterviewConfig extends Object {
    allowedDays: Array<{ dayName: string, dayId: number }>;
    createdAt: Date = new Date();
    hollyDaysEnabled: Boolean = false;
    hollyDays:Array<string> = [];
    previosEnabled: Boolean = false;
    previosDays: Array<string> = [];
    configId: string;
    creatorId: string;
    interviewHoursDuration: number = 1;
    interviewMinuteDuration: number =  0;
    interviewMaxNumber: number = 8;
    startOfTheDay: string = '8:00'
    endOfTheDay: string = '18:00'
    unauthorizedHour: Array<string> = [] ;
    constructor() {
        super();
    }
}

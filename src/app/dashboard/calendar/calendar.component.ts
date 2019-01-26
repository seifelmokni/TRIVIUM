import { Component, ChangeDetectionStrategy, ViewChild, TemplateRef, OnInit, ViewEncapsulation, ElementRef } from '@angular/core';
import { startOfDay, endOfDay, subDays, addDays, endOfMonth, isSameDay, isSameMonth, addHours } from 'date-fns';
import { Subject } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CalendarEvent, CalendarEventAction, CalendarEventTimesChangedEvent, CalendarView, CalendarMonthViewDay } from 'angular-calendar';
import { InterviewConfig } from '../../models/interview-config.model';
import { ConfigurationService } from '../../shared/configuration/configuration.service';
import { AuthService } from 'src/app/shared/auth/auth.service';
import { InterviewDateService } from 'src/app/shared/interviewDate/interview-date.service';
import { Interview } from 'src/app/models/interview/interview.model';
import { Candidate } from 'src/app/models/candidate/candidate.model';
import { CandidateService } from 'src/app/shared/candidate/candidate.service';
import { DayViewHour } from 'calendar-utils';
const colors: any = {
    red: {
        primary: '#ad2121',
        secondary: '#FAE3E3'
    },
    blue: {
        primary: '#1e90ff',
        secondary: '#D1E8FF'
    },
    yellow: {
        primary: '#e3bc08',
        secondary: '#FDF1BA'
    }
};
@Component({
    selector: 'app-calendar',
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: './calendar.component.html',
    styleUrls: ['./calendar.component.css'],
    encapsulation: ViewEncapsulation.None
})
export class CalendarComponent implements OnInit {
    @ViewChild('modalContent')
    @ViewChild('startOfDay') startOfDay: ElementRef;
    @ViewChild('endOfDay') endOfDay: ElementRef;
    modalContent: TemplateRef<any>;

    view: CalendarView = CalendarView.Month;

    CalendarView = CalendarView;

    viewDate: Date = new Date();

    modalData: {
        action: string;
        event: CalendarEvent;
    };

    actions: CalendarEventAction[] = [
        {
            label: '<i class="fa fa-fw fa-pencil"></i>',
            onClick: ({ event }: { event: CalendarEvent }): void => {
                this.handleEvent('Edited', event);
            }
        },
        {
            label: '<i class="fa fa-fw fa-times"></i>',
            onClick: ({ event }: { event: CalendarEvent }): void => {
                this.events = this.events.filter(iEvent => iEvent !== event);
                this.handleEvent('Deleted', event);
            }
        }
    ];

    refresh: Subject<any> = new Subject();

    events: CalendarEvent[] = [];
    eventsData: Array<{candidate: string , interview: Interview}> =[];
    interviews: Interview[] = [];
    candidates: Candidate[];
    isAllInterviewsDisplayed: Boolean = false;

    days: Array<{ dayName: string, dayId: number }> = [
        { dayName: 'domingo', dayId: 1 },
        { dayName: 'lunes', dayId: 2 },
        { dayName: 'martes', dayId: 3 },
        { dayName: 'miércoles', dayId: 4 },
        { dayName: 'jueves', dayId: 5 },
        { dayName: 'viernes', dayId: 6 },
        { dayName: 'sábado', dayId: 7 },
    ];
    hours: Array<string> = [
        '08:00','08:30','09:00','09:30','10:00','10:30','11:00','11:30','12:00','12:30','13:00','13:30','14:00','14:30','15:00','15:30','16:00','16:30','17:00','17:30','18:00' 
    ]

    daysChecked: Array<{ isChecked: Boolean }> = [
        { isChecked: false },
        { isChecked: false },
        { isChecked: false },
        { isChecked: false },
        { isChecked: false },
        { isChecked: false },
        { isChecked: false },
    ];

    interviewConfig: InterviewConfig;

    activeDayIsOpen = false;
    configEditionEnabled = false;
    setDaysType;
    setAuthHours;

    constructor(private modal: NgbModal,
         private configService: ConfigurationService,
         private authService: AuthService,
         private interViewService: InterviewDateService,
         private candidateService: CandidateService) { }

    ngOnInit() {
          this.interviewConfig = new InterviewConfig();
          this.interviewConfig.allowedDays = [];
          this.interviewConfig.hollyDaysEnabled = false;
          this.interviewConfig.creatorId = this.authService.getUserSession().userID;
        this.configService.listInterViewConfigurtaion().subscribe(
            (interviewConfigs: InterviewConfig[]) => {
                if (interviewConfigs.length === 0) {
                } else {
                    this.interviewConfig = interviewConfigs[0];
                    console.log('interview config'); 
                    console.log(this.interviewConfig);
                    for(let i = 0 ; i < this.interviewConfig.allowedDays.length ; i++){
                        console.log('day checked'); 
                        console.log('day ' + this.interviewConfig.allowedDays[i].dayName + "id " + this.interviewConfig.allowedDays[i].dayId);
                        this.daysChecked[this.interviewConfig.allowedDays[i].dayId -1].isChecked = true;
                    }
                    console.log(this.daysChecked);
                    this.refresh.next();
                }
            }
        );
        

        
    }

   
    beforeMonthViewRender({ body }: { body: CalendarMonthViewDay[] }): void {
        console.log('interview config');
        console.log(this.interviewConfig);
        if(!this.interviewConfig.hollyDaysEnabled){
            if(this.interviewConfig.hollyDays !== undefined){
                for(let i = 0 ; i< this.interviewConfig.hollyDays.length ; i++){
                    body.forEach(
                        day => {
                            if(day.date.toString() === this.interviewConfig.hollyDays[i]){
                                day.cssClass = 'cal-day-disabled';
                            }
                        }
                    )
                }
            }
        }
        if(this.interviewConfig.previosEnabled){
            if(this.interviewConfig.previosDays !== undefined){
                for(let i = 0 ; i < this.interviewConfig.previosDays.length ; i++){
                    body.forEach(
                        day => {
                            if(day.date.toString() === this.interviewConfig.previosDays[i]){
                                day.cssClass = 'cal-day-selected';
                            }
                        }
                    )
                }
            }
        }
        console.log('beforeMonthViewRender');
        console.log(this.daysChecked);
        for (let i = 0 ; i < this.daysChecked.length ; i++){
            if(this.daysChecked[i].isChecked == false ){
                body.forEach(day => {
                    if(day.date.getDay() === i){
                        day.cssClass = 'cal-day-disabled';
                    }
                });            
            }
        }  
      }


    dayClicked({ date, events }: { date: Date; events: CalendarEvent[] }): void {
        /* if (isSameMonth(date, this.viewDate)) {
            this.viewDate = date;
            if (
                (isSameDay(this.viewDate, date) && this.activeDayIsOpen === true) ||
                events.length === 0
            ) {
                this.activeDayIsOpen = false;
            } else {
                this.activeDayIsOpen = true;
            }
        } */
        if(this.interviewConfig.hollyDays === undefined){
            this.interviewConfig.hollyDays = [];
        }
        if(this.interviewConfig.previosDays === undefined){
            this.interviewConfig.previosDays = [];
        }
        console.log('set days type');
        console.log(this.setDaysType);
        if(this.setDaysType !== undefined){
            console.log('selected day') ; 
            console.log(date);
            if(this.setDaysType === 1){
                if(!this.interviewConfig.hollyDaysEnabled){
                    if(this.interviewConfig.hollyDays.indexOf(date.toString()) !== -1 ){
                        this.interviewConfig.hollyDays.splice(
                            this.interviewConfig.hollyDays.indexOf(date.toString()),
                            1
                        );
                    }else{
                        this.interviewConfig.hollyDays.push(date.toString());
                    }
                    this.refresh.next();
                }
            }
            if(this.setDaysType === 2){
                if(this.interviewConfig.previosEnabled){
                    if(this.interviewConfig.previosDays.indexOf(date.toString()) !== -1 ){
                        this.interviewConfig.previosDays.splice(
                            this.interviewConfig.previosDays.indexOf(date.toString()),
                            1
                        );
                    }else{
                        this.interviewConfig.previosDays.push(date.toString());
                    }
                    this.refresh.next();
                }
            }
            
        }
        
        
    }

    eventTimesChanged({
        event,
        newStart,
        newEnd
    }: CalendarEventTimesChangedEvent): void {
        event.start = newStart;
        event.end = newEnd;
        this.handleEvent('Dropped or resized', event);
        this.refresh.next();
    }

    handleEvent(action: string, event: CalendarEvent): void {
        //     this.modalData = { event, action };
        //     this.modal.open(this.modalContent, { size: 'lg' });
    }

    addEvent(): void {
        this.events.push({
            title: 'New event',
            start: startOfDay(new Date()),
            end: endOfDay(new Date()),
            color: colors.red,
            draggable: true,
            resizable: {
                beforeStart: true,
                afterEnd: true
            }
        });
        this.refresh.next();
    }
    addDayToConfig(day: { dayName: string, dayId: number }, index: number) {
        let foundIndex = -1;
        for (let i = 0; i < this.interviewConfig.allowedDays.length; i++) {
            if (this.interviewConfig.allowedDays[i].dayId === day.dayId) {
                foundIndex = i;
                break;
            }
        }
        if (foundIndex === -1) {
            this.interviewConfig.allowedDays.push(day);
            this.daysChecked[index].isChecked = true;
        } else {
            this.interviewConfig.allowedDays.splice(foundIndex, 1);
            this.daysChecked[index].isChecked = false;
        }
        this.refresh.next();

    }

    changeAllowedOnHollyDays() {
        this.interviewConfig.hollyDaysEnabled = !this.interviewConfig.hollyDaysEnabled;
    }
    changePreviosEnabled(){
        this.interviewConfig.previosEnabled = !this.interviewConfig.previosEnabled;
    }

    editConfig() {
        this.saveConfig();
    }
    startOfTheDayChanged(){
        const startOFHour = this.startOfDay.nativeElement.options[this.startOfDay.nativeElement.selectedIndex].value ; 
        this.interviewConfig.startOfTheDay = startOFHour ; 
        this.refresh.next() ; 
    }
    endOfTheDayChanged(){
        const endHour = this.endOfDay.nativeElement.options[this.endOfDay.nativeElement.selectedIndex].value ; 
        this.interviewConfig.endOfTheDay = endHour ; 
        this.refresh.next();
    }
    hourSegmentClicked(date: Date) {
        console.log('hour seg clicked') ; 
        console.log(date);
        console.log(date.getHours());
        console.log(date.getMinutes()); 
        const h = date.getHours() ; 
        const m = date.getMinutes() ; 
        const hm = h+':'+(m == 0 ? '00' : m) ; 
        if(this.interviewConfig.unauthorizedHour == undefined){
            this.interviewConfig.unauthorizedHour = [] ; 
        }
        if(this.interviewConfig.unauthorizedHour.indexOf(hm) == -1){
            this.interviewConfig.unauthorizedHour.push(hm);
            
        }else{
            this.interviewConfig.unauthorizedHour.splice(this.interviewConfig.unauthorizedHour.indexOf(hm) , 1) ; 
        }
        this.refresh.next();
    }
    beforeDayViewRender(dayView) {
        console.log('beforeDayViewRender');
        console.log(dayView.hourGrid);
        dayView.body.hourGrid.forEach(
            hourGrid => {
                console.log('hour grid');
                console.log(hourGrid);
                hourGrid.segments.forEach(
                    s => {
                        console.log('s');
                        console.log(s.date.getHours());
                        const startHour = parseInt(this.interviewConfig.startOfTheDay.split(':')[0]);
                        const startMin = parseInt(this.interviewConfig.startOfTheDay.split(':')[1]);

                        const endHour = parseInt(this.interviewConfig.endOfTheDay.split(':')[0]);
                        const endMin = parseInt(this.interviewConfig.endOfTheDay.split(':')[1]);
                        
                        if((s.date.getHours() < startHour) || (s.date.getHours() == startHour && s.date.getMinutes() < startMin)){
                            console.log('disable '+s.date.getHours());
                            s.cssClass = 'cal-day-disabled';
                        }
                        if((s.date.getHours() >  endHour) || (s.date.getHours() == endHour && s.date.getMinutes() < endMin)){
                            console.log('disable '+s.date.getHours());
                            s.cssClass = 'cal-day-disabled';
                        }
                        const hm = s.date.getHours()+':'+(s.date.getMinutes() == 0 ? '00': s.date.getMinutes());
                        if(this.interviewConfig.unauthorizedHour != undefined){
                            if(this.interviewConfig.unauthorizedHour.indexOf(hm) != -1){
                                s.cssClass = 'cal-day-disabled'
                            }
                        }
                    }
                );
            }
        )
        //this.addSelectedDayViewClass(dayView);
      }
 
    saveConfig() {
        console.log('config to save');
        console.log(this.interviewConfig);
        this.configService.saveInterViewConfiguration(this.interviewConfig);
        this.configEditionEnabled = false;
    }




}

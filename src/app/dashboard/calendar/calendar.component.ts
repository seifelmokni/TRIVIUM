import { Component, ChangeDetectionStrategy, ViewChild, TemplateRef, OnInit, ViewEncapsulation } from '@angular/core';
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
    saveConfig() {
        console.log('config to save');
        console.log(this.interviewConfig);
        this.configService.saveInterViewConfiguration(this.interviewConfig);
        this.configEditionEnabled = false;

      
    }




}

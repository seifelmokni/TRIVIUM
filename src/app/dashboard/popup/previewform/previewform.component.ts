import { Component, OnInit, Inject, ViewChild, ElementRef, TemplateRef, Renderer2 } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { ViewEncapsulation } from '@angular/compiler/src/core';
import { Form } from 'src/app/models/form/form.model';
import { Page } from 'src/app/models/page/page.model';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { Candidate } from 'src/app/models/candidate/candidate.model';
import { CalendarView, CalendarEvent, CalendarEventAction, CalendarMonthViewDay, CalendarEventTimesChangedEvent } from 'angular-calendar';
import { Subject } from 'rxjs';
import { InterviewConfig } from 'src/app/models/interview-config.model';
import { Interview } from 'src/app/models/interview/interview.model';
import { DayViewHour } from 'calendar-utils';
import { FormsService } from 'src/app/shared/forms/forms.service';
import { ResponseService } from 'src/app/shared/response/response.service';
import { Router } from '@angular/router';
import { CandidateService } from 'src/app/shared/candidate/candidate.service';
import { ConfigurationService } from 'src/app/shared/configuration/configuration.service';
import { AuthService } from 'src/app/shared/auth/auth.service';
import { InterviewDateService } from 'src/app/shared/interviewDate/interview-date.service';
import { addHours, startOfDay } from 'date-fns';
import { Response } from 'src/app/models/response/response.model';
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
  selector: 'app-previewform',
  templateUrl: './previewform.component.html',
  styleUrls: ['./previewform.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class PreviewformComponent implements OnInit {


  @ViewChild('left_container') left_container: ElementRef;
  @ViewChild('right_container') right_container: ElementRef;
  @ViewChild('formCandidate') formCandidate: ElementRef;
  elementCounter = 0;
  forms: Form[];
  form: Form;
  page: Page;
  pageIndex = 0;

  condidateForm: FormGroup;
  candidateResponse: Response;
  candidate: Candidate;
  pageRequiredFields: Array<number>;
  pageNotRequiredFields: Array<number>;
  shouldShowCalendarPage: Boolean = false;

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
  days: Array<{ dayName: string, dayId: number }> = [
      { dayName: 'lunes', dayId: 1 },
      { dayName: 'martes', dayId: 2 },
      { dayName: 'miércoles', dayId: 3 },
      { dayName: 'jueves', dayId: 4 },
      { dayName: 'viernes', dayId: 5 },
      { dayName: 'sábado', dayId: 6 },
      { dayName: 'domingo', dayId: 7 },
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
  activeDayIsOpen = false;


  refresh: Subject<any> = new Subject();

  events: CalendarEvent[] = [];
  interviewConfig: InterviewConfig;
  interViewDates: Interview[] = [];
  bookedInterviews: Interview[] = [];
  bookedDates: Array<{date: Date , interviewNumber: number }> = [];
  selectedDays: any = [];
  selectedMonthViewDay: CalendarMonthViewDay;
  selectedDayViewDate: Date;
  dayView: DayViewHour[];

  message;
  confirm = true;

  constructor(
      public dialogRef: MatDialogRef<PreviewformComponent>,
      @Inject(MAT_DIALOG_DATA) public data: { form: Form },
      private elementRef: ElementRef,
      private formService: FormsService,
      private formBuilder: FormBuilder,
      private renderer: Renderer2,
      private responseService: ResponseService,
      private router: Router,
      private candidateService: CandidateService,
      private configService: ConfigurationService,
      private authService: AuthService,
      private interviewDateService: InterviewDateService) {
      this.form = data.form;
  }


  ngOnInit() {
    this.candidate = new Candidate();
    this.condidateForm = this.formBuilder.group({});
    this.pageRequiredFields = [];
    this.pageNotRequiredFields = [];
    console.log('now');
    console.log(new Date());
    const now = new Date();
                    console.log('the form');
                    console.log(this.form);
                    if (this.form !== undefined) {
                        if (this.form.pages.length > 0) {
                            this.page = this.form.pages[0];
                            for (let i = 0; i < this.page.formComposition.length; i++) {
                                console.log('element');
                                console.log(this.page.formComposition[i].container);
                                let options = [];
                                if (this.page.formComposition[i].options !== undefined) {
                                    options = JSON.parse(this.page.formComposition[i].options);
                                }
                                console.log('options  ' + this.page.formComposition[i].options);
                                console.log(options);
                                if(this.left_container !== undefined){
                                    this.createElement(
                                        this.page.formComposition[i].type,
                                        (this.page.formComposition[i].container === 'LEFT' ? 1 : 2),
                                        this.page.formComposition[i].labelTitle,
                                        i,
                                        options
                                    );
                                }
                                
                            }
                            this.candidateResponse = new Response();
                            this.candidateResponse.formId = this.form.formId;
                        }
                    }
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
              
              
          }
      }
  );

  this.interviewDateService.listAllInterview().subscribe(
      (ids: Interview[]) => {
          console.log('all interviews') ;
          console.log(ids)
          this.bookedInterviews = ids;
          for(let i = 0 ; i< this.bookedInterviews.length ; i ++){
              console.log('interview date');
              console.log(this.bookedInterviews[i].interviewDate);
              console.log('interview date');
              console.log(this.bookedInterviews[i].interviewDate);
              let dateFound= false;
              for(let j = 0 ; j < this.bookedDates.length ; j++){
                  if(this.bookedInterviews[i].interviewDate === this.bookedDates[j].date.toString() ){
                    this.bookedDates[j].interviewNumber ++ ; 
                    dateFound = true;
                    }
              }
              if(!dateFound){
                  this.bookedDates.push({date: new Date(this.bookedInterviews[i].interviewDate) , interviewNumber: 0});
              }
          }
      }
  )
}

beforeMonthViewRender({ body }: { body: CalendarMonthViewDay[] }): void {

    console.log('beforeMonthViewRender');
    body.forEach(day => {
        if(day.isPast || day.isToday){
            day.cssClass = 'cal-day-disabled';
        }
    });
    for (let i = 0 ; i < this.daysChecked.length ; i++){
        if(this.daysChecked[i].isChecked == false ){
            body.forEach(day => {
                if(day.date.getDay() === i){
                    day.cssClass = 'cal-day-disabled';
                }
            });            
        }
    }
    console.log('booked days');
    console.log(this.bookedDates);
    for(let i = 0 ; i< this.bookedDates.length ; i++){
        body.forEach(day => {
            if(this.bookedDates[i].date.toString() === this.formateDate(day.date).toString()){
                console.log('interview config'); 
                console.log(this.interviewConfig);
                if(this.bookedDates[i].interviewNumber < this.interviewConfig.interviewMaxNumber){
                    day.cssClass = 'cal-day-part-booked';
                }else{
                    day.cssClass = 'cal-day-full-booked';
                }
            }
        });
    }
    for(let i = 0 ; i< this.interViewDates.length ; i++){
        body.forEach(day => {
            if(this.interViewDates[i].interviewDate.toString() === this.formateDate(day.date).toString()){
                day.cssClass = 'cal-day-selected';
            }
        });
    }
    
  }

dayClicked(day: CalendarMonthViewDay): void {
    console.log('dayClicked '+day.date);
    
        
        let dateFoundIndex = -1;
        for(let i = 0 ; i < this.interViewDates.length ; i++){
            if(this.interViewDates[i].interviewDate.toString() === this.formateDate(day.date).toString()){
                dateFoundIndex = i ; 
                break;
            }
        }
        console.log(dateFoundIndex);
        if(dateFoundIndex === -1){
            if(this.interViewDates.length < 4){
            this.viewDate.setDate(day.date.getDate());
            this.view = CalendarView.Day;
            const interview = new Interview();
            interview.interviewDate = this.formateDate(day.date).toString();
            console.log('interview');
            console.log(interview);
            this.interViewDates.push(interview);
            }
        }else{
            this.interViewDates.splice(dateFoundIndex , 1);
            delete day.cssClass;
            console.log(this.interViewDates);
        } 
    
   
  }
  hourSegmentClicked(date: Date) {
    console.log('hour segment clicked');
    console.log(date.getHours());
    console.log(date);
    let dateFoundIndex = -1;
        for(let i = 0 ; i < this.interViewDates.length ; i++){
            console.log('formated hous date');
            console.log(this.formateDate(date));
            console.log(this.interViewDates[i].interviewDate);
            if(this.interViewDates[i].interviewDate.toString() === this.formateDate(date).toString()){
                dateFoundIndex = i ; 

                this.interViewDates[i].interviewStartHour = date.getHours();
                this.interViewDates[i].interviewStartMinute = date.getMinutes();

                this.interViewDates[i].interviewEndHour = date.getHours() + this.interviewConfig.interviewHoursDuration;
                this.interViewDates[i].interviewEndMinute = date.getMinutes() + this.interviewConfig.interviewMinuteDuration;
                
                console.log('interview is ');
                console.log(this.interViewDates[i]);
                console.log(new Date(this.interViewDates[i].interviewDate));
                this.events.push({
                    title: 'reserva '+this.interViewDates[i].interviewStartHour,
                    start: addHours(startOfDay(new Date(this.interViewDates[i].interviewDate)),this.interViewDates[i].interviewStartHour),
                    end: addHours(startOfDay(new Date(this.interViewDates[i].interviewDate)),
                     this.interViewDates[i].interviewStartHour + (this.interViewDates[i].interviewEndHour !== NaN ? this.interViewDates[i].interviewStartHour: this.interviewConfig.interviewHoursDuration)),
                    color: colors.red,
                    draggable: false,
                    resizable: {
                        beforeStart: false,
                        afterEnd: false
                    }
                });
                this.refresh.next();
                console.log(this.interViewDates[i]);
                this.view = CalendarView.Month;  
                break;
            }
        }
    //this.addSelectedDayViewClass();
  }
  beforeDayViewRender(dayView: DayViewHour[]) {
    this.dayView = dayView;
    this.addSelectedDayViewClass();
  }
  private addSelectedDayViewClass() {
    this.dayView.forEach(hourSegment => {
      hourSegment.segments.forEach(segment => {
        delete segment.cssClass;
        if (
          this.selectedDayViewDate &&
          segment.date.getTime() === this.selectedDayViewDate.getTime()
        ) {
          segment.cssClass = 'cal-day-selected';
        }
      });
    });
  }


/*
dayClicked({ date, events }: { date: Date; events: CalendarEvent[] }): void {
    console.log('day Click');
    this.view = CalendarView.Day;
    
    if (isSameMonth(date, this.viewDate)) {
        this.viewDate = date;
        if (
            (isSameDay(this.viewDate, date) && this.activeDayIsOpen === true) ||
            events.length === 0
        ) {
            this.activeDayIsOpen = false;
        } else {
            this.activeDayIsOpen = true;
        }
    } 
    
}
*/

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
    console.log('handle event');
    //     this.modalData = { event, action };
    //     this.modal.open(this.modalContent, { size: 'lg' });
}

addEvent(): void {
    /*
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
    this.refresh.next();*/
}

createElement(type: string, container, labelTitle: string, index: number, values: Array<string>) {
    this.elementCounter = index;
    console.log('type is ' + type);
    let div = '<div class="two-col dynamic" style="opacity: 1; background: none;" draggable="true"' +
        ' id="el-' + this.elementCounter + '" >';
    switch (type) {
        case 'single_line': {
            div += '<label id="lbl-' + this.elementCounter + '" >' + (labelTitle === undefined ? 'Single Line' : labelTitle) +
                '</label>' +
                '<input type="text" id="fc' + this.elementCounter + '"  name="singleLine" />';
            this.condidateForm.addControl('fc' + this.elementCounter, new FormControl(''));
            break;
        }
        case 'phone': {
            div += '<label >' + (labelTitle === undefined ? 'phone' : labelTitle) + '</label>' +
                '<input type="tel" id="fc' + this.elementCounter + '" name="phone" />';
            this.condidateForm.addControl('fc' + this.elementCounter, new FormControl(''));

            break;
        }
        case 'multi_line': {
            div += '<label for="" id="lbl-' + this.elementCounter + '" >' + (labelTitle === undefined ? 'Multi line' : labelTitle) +
                '</label>' +
                '<textarea id="fc' + this.elementCounter + '" name="multiLine" cols="25" rows="5" defaultvalue=""></textarea>';
            this.condidateForm.addControl('fc' + this.elementCounter, new FormControl(''));

            break;
        }
        case 'url': {
            div += '<label for="" id="lbl-' + this.elementCounter + '" >' + (labelTitle === undefined ? 'url' : labelTitle) +
                '</label>' + '<input type="url" id="fc' + this.elementCounter + '" name="url" />';
            this.condidateForm.addControl('fc' + this.elementCounter, new FormControl(''));

            break;
        }
        case 'date': {
            div += '<label for="" id="lbl-' + this.elementCounter + '" >' + (labelTitle === undefined ? 'date' : labelTitle) +
                '</label>' + '<input type="date" id="fc' + this.elementCounter + '" name="date" />';
            this.condidateForm.addControl('fc' + this.elementCounter, new FormControl(''));

            break;
        }
        case 'file_upload': {
            div += '<label for="" id="lbl-' + this.elementCounter + '" >' + (labelTitle === undefined ? 'File' : labelTitle) +
                '</label>' + '<input type="file" id="fc' + this.elementCounter + '" name="fileUpload" />';
            this.condidateForm.addControl('fc' + this.elementCounter, new FormControl(''));

            break;
        }
        case 'radio': {
            div += '<label for="" id="lbl-' + this.elementCounter + '" >' + (labelTitle === undefined ? 'Radio' : labelTitle) +
                '</label>' +
                '<div>';
            for (let i = 0; i < values.length; i++) {
                div += '<p>' +
                    '<input type="radio" name="checkbox" id="fc' + this.elementCounter + '-' + i + '" ' +
                    ' value="checkbox 1"><label for="radio1">' + values[i] + '</label>' +
                    '</p>';
            }

            div += '</div>';
            this.condidateForm.addControl('fc' + this.elementCounter, new FormControl(''));

            break;
        }
        case 'image': {
            div += '<label for="" id="lbl-' + this.elementCounter + '" >' + (labelTitle === undefined ? 'image' : labelTitle) +
                '</label>' + '<input type="file" id="fc' + this.elementCounter + '" name="image" />';
            this.condidateForm.addControl('fc' + this.elementCounter, new FormControl(''));

            break;
        }
        case 'checkbox': {
            div += '<label for="" id="lbl-' + this.elementCounter + '" >' + (labelTitle === undefined ? 'Radio' : labelTitle) +
                '</label>' +
                '<div>';
            for (let i = 0; i < values.length; i++) {
                div += '<p>' +
                    '<input type="checkbox" name="checkbox" id="fc' + this.elementCounter + '-' + i + '" ' +
                    ' value="checkbox 1"><label for="radio1">' + values[i] + '</label>' +
                    '</p>';
            }

            div += '</div>';
            this.condidateForm.addControl('fc' + this.elementCounter, new FormControl(''));

            break;
        }
        case 'text': {
            div += '<label for="" id="lbl-' + this.elementCounter + '" >' + (labelTitle === undefined ? 'text' : labelTitle) +
                '</label>' + '<input type="text" id="fc' + this.elementCounter + '" name="text" />';
            this.condidateForm.addControl('fc' + this.elementCounter, new FormControl(''));

            break;
        }
        case 'email': {
            div += '<label for="" id="lbl-' + this.elementCounter + '" >' + (labelTitle === undefined ? 'email' : labelTitle) +
                '</label>' + '<input type="email" id="fc' + this.elementCounter + '" name="email" />';
            this.condidateForm.addControl('fc' + this.elementCounter, new FormControl(''));

            break;
        }
        case 'number': {
            div += '<label for="" id="lbl-' + this.elementCounter + '" >' + (labelTitle === undefined ? 'number' : labelTitle) +
                '</label>' + '<input type="number" id="fc' + this.elementCounter + '" name="number" />';
            this.condidateForm.addControl('fc' + this.elementCounter, new FormControl(''));

            break;
        }
        case 'description': {
            div += '<label for="" id="lbl-' + this.elementCounter + '" >' + (labelTitle === undefined ? 'description' : labelTitle) +
                '</label>' +
                '<textarea id="fc' + this.elementCounter + '" name="description" cols="25" rows="5" defaultvalue=""></textarea>';
            this.condidateForm.addControl('fc' + this.elementCounter, new FormControl(''));

            break;
        }
        case 'decimal': {
            div += '<label for="" id="lbl-' + this.elementCounter + '" >' + (labelTitle === undefined ? 'Decimal' : labelTitle) +
                '</label>' + '<input type="text" id="fc' + this.elementCounter + '" name="decimal" />';
            this.condidateForm.addControl('fc' + this.elementCounter, new FormControl(''));

            break;
        }
        case 'multi_select': {
            div += '<label for="" id="lbl-' + this.elementCounter + '" >' + (labelTitle === undefined ? 'Multi select' : labelTitle) +
                '</label>' +
                '<select multiple="" id="fc' + this.elementCounter + '" name="multiSelect">' +
                '<option value="">--por favor, elija--</option>';
            for (let i = 0; i < values.length; i++) {
                div += '<option value="' + values[i] + '">' + values[i] + '</option>';
            }
            div += '</select>';
            this.condidateForm.addControl('fc' + this.elementCounter, new FormControl(''));

            break;
        }
        case 'dropdown': {
            div += '<label for="" id="lbl-' + this.elementCounter + '" >' + (labelTitle === undefined ? 'Dropdown' : labelTitle) +
                '</label>' +
                '<select id="fc' + this.elementCounter + '" name="dropdown"><option value="">--por favor, elija--</option>';
            for (let i = 0; i < values.length; i++) {
                div += '<option value="' + values[i] + '">' + values[i] + '</option>';
            }
            div += '</select>';
            this.condidateForm.addControl('fc' + this.elementCounter, new FormControl(''));

            break;
        }
        case 'note': {
            div += '<label for="" id="lbl-' + this.elementCounter + '" >' + (labelTitle === undefined ? 'Note' : labelTitle) +
                '</label>' +
                '<textarea id="fc' + this.elementCounter + '" name="note" cols="25" rows="5" defaultvalue=""></textarea>';
            this.condidateForm.addControl('fc' + this.elementCounter, new FormControl(''));

            break;
        }
        case 'percent': {
            div += '<label for="" id="lbl-' + this.elementCounter + '" >' + (labelTitle === undefined ? 'Percent' : labelTitle) +
                '</label>' +
                '<input type="text" id="fc' + this.elementCounter + '" name="percent" />';
            this.condidateForm.addControl('fc' + this.elementCounter, new FormControl(''));

            break;
        }
        case 'password': {
            div += '<label for="" id="lbl-' + this.elementCounter + '" >' + (labelTitle === undefined ? 'Password' : labelTitle) +
                '</label>' +
                '<input type="password" id="fc' + this.elementCounter + '" name="percent" />';
            break;
        }
        case 'white_space': {
            div += '<label class="whitespace" id="lbl-' + this.elementCounter + '" style="height: 20px;">  </label>';
            div += '<span > </span>';
            break;
        }

    }
    let path = '';
    if (container === 1) {
        path = '<path fill="currentColor" ' +
            // tslint:disable-next-line:max-line-length
            'd="M256 8c137 0 248 111 248 248S393 504 256 504 8 393 8 256 119 8 256 8zM140 300h116v70.9c0 10.7 13 16.1 20.5 8.5l114.3-114.9c4.7-4.7 4.7-12.2 0-16.9l-114.3-115c-7.6-7.6-20.5-2.2-20.5 8.5V212H140c-6.6 0-12 5.4-12 12v64c0 6.6 5.4 12 12 12z">' +
            '</path>';
    } else {
        path = '<path fill="currentColor" '
            // tslint:disable-next-line:max-line-length
            + 'd="M256 504C119 504 8 393 8 256S119 8 256 8s248 111 248 248-111 248-248 248zm116-292H256v-70.9c0-10.7-13-16.1-20.5-8.5L121.2 247.5c-4.7 4.7-4.7 12.2 0 16.9l114.3 114.9c7.6 7.6 20.5 2.2 20.5-8.5V300h116c6.6 0 12-5.4 12-12v-64c0-6.6-5.4-12-12-12z">'
            + '</path>';
    }

    div += '</div>';
    if (container === 1) {
        this.left_container.nativeElement.insertAdjacentHTML('beforeEnd', div);
    } else {
        this.right_container.nativeElement.insertAdjacentHTML('beforeEnd', div);

    }
    if (this.elementRef.nativeElement.querySelector('#fc' + this.elementCounter)) {
        this.elementRef.nativeElement.querySelector('#fc' + this.elementCounter).addEventListener('change',
            (event) => this.formInputValueChanged(this.elementCounter, type, this.page.conditions));

    } else {
        for (let i = 0; i < values.length; i++) {
            this.elementRef.nativeElement.querySelector('#fc' + this.elementCounter + '-' + i).addEventListener('change',
                (event) => this.formInputValueChanged(this.elementCounter, type, this.page.conditions));
        }
    }
}

formInputValueChanged(index, type, conditions) {
    console.log('form input value changed ' + index + ' ' + type);
    console.log(conditions);
    for (let i = 0; i < conditions.length; i++) {
        console.log('index ' + this.page.formComposition[index].id + ' condition compare to ' + conditions[i].compareTo);
        if (this.page.formComposition[index].id.toString() === conditions[i].compareTo.toString()) {
            console.log('index match');
            const r = this.getFieldResponse(index);
            console.log('field response');
            console.log(r.value);
            console.log('condition compare Value');
            console.log(conditions[i].compareValue);
            if (r.value === conditions[i].compareValue) {
                console.log('value match');
                console.log('condition action type');
                console.log(conditions[i].actionType);
                this.applyCondition(conditions[i], r);
            } else {
                if (conditions[i].actionType === 'mask') {
                    this.applyCondition(conditions[i], r);
                }
            }
        }
    }
}

applyCondition(condition, response) {
    switch (condition.actionType) {
        case 'mask': {
            console.log('case mask');
            console.log('condition action on');
            console.log(condition.actionOn);
            this.renderer.setAttribute(
                this.elementRef.nativeElement.querySelector('#fc' + condition.actionOn),
                'disabled',
                response.value === condition.compareValue ? 'true' : 'false'
            );
            this.renderer.setStyle(
                this.elementRef.nativeElement.querySelector('#fc' + condition.actionOn),
                'pointer',
                response.value === condition.compareValue ? 'not-allowed' : ''
            );
            this.renderer.setStyle(
                this.elementRef.nativeElement.querySelector('#fc' + condition.actionOn),
                'background',
                response.value === condition.compareValue ? '#e8e8e8' : 'none'
            );
            break;
        }
        case 'fieldRequired': {
            let foundIndex = -1;
            for (let i = 0; i < this.pageRequiredFields.length; i++) {
                if (this.pageRequiredFields[i] === condition.actionOn) {
                    foundIndex = i;
                    break;
                }
            }
            if (foundIndex === -1) {
                this.pageRequiredFields.push(condition.actionOn);
                this.elementRef.nativeElement.querySelector('#lbl-' + condition.actionOn).innerHTML =
                    this.elementRef.nativeElement.querySelector('#lbl-' + condition.actionOn).innerHTML + '*';
            } else {
                if (response.value !== condition.compareValue) {
                    this.pageRequiredFields.splice(foundIndex, 1);
                    this.elementRef.nativeElement.querySelector('#lbl-' + condition.actionOn).innerHTML =
                        this.elementRef.nativeElement.querySelector('#lbl-' + condition.actionOn).innerHTML.replace(/\*/g, '');
                }

            }
            break;
        }
        case 'fieldNotRequired': {
            let foundIndex = -1;
            for (let i = 0; i < this.pageRequiredFields.length; i++) {
                if (this.pageRequiredFields[i] === condition.actionOn) {
                    foundIndex = i;
                    break;
                }
            }
            if (foundIndex === -1) {
                this.pageNotRequiredFields.push(condition.actionOn);
                this.elementRef.nativeElement.querySelector('#lbl-' + condition.actionOn).innerHTML =
                    this.elementRef.nativeElement.querySelector('#lbl-' + condition.actionOn).innerHTML.replace(/\*/g, '');
            } else {
                if (response.value !== condition.compareValue) {
                    this.pageNotRequiredFields.splice(foundIndex, 1);
                    let isFieldRequired: Boolean = false;
                    for (let i = 0; i < this.page.formComposition.length; i++) {
                        if (this.page.formComposition[i].id === condition.actionOn) {
                            isFieldRequired = this.page.formComposition[i].isRequired;
                            break;
                        }
                    }
                    if (isFieldRequired) {
                        this.elementRef.nativeElement.querySelector('#lbl-' + condition.actionOn).innerHTML =
                            this.elementRef.nativeElement.querySelector('#lbl-' + condition.actionOn).innerHTML + '*';

                    }
                }
            } break;
        }
        case 'copyValue': {
            let acitonOnIndex = -1;
            for (let i = 0; i < this.page.formComposition.length; i++) {
                if (this.page.formComposition[i].id === condition.actionOn) {
                    acitonOnIndex = i;
                    break;
                }
            }
            let acitonFromIndex = -1;
            for (let i = 0; i < this.page.formComposition.length; i++) {
                if (this.page.formComposition[i].id === condition.actionFrom) {
                    acitonFromIndex = i;
                    break;
                }
            }
            let value = '';
            if (acitonFromIndex !== -1) {
                value = this.getFieldResponse(acitonFromIndex).value;
            }
            if (acitonOnIndex !== -1) {
                this.setFieldResponse(acitonOnIndex, value);
            }


            break;
        }
        case 'copyText': {
            let acitonOnIndex = -1;
            for (let i = 0; i < this.page.formComposition.length; i++) {
                if (this.page.formComposition[i].id === condition.actionOn) {
                    acitonOnIndex = i;
                    break;
                }
            }
            if (acitonOnIndex !== -1) {
                this.setFieldResponse(acitonOnIndex, condition.actionFrom);
            }

            break;
        }
    }
}

loadPage(index) {
    this.left_container.nativeElement.innerHTML = '';
    this.right_container.nativeElement.innerHTML = '';
    if (this.form !== undefined) {
        this.page = this.form.pages[index];
        for (let i = 0; i < this.page.formComposition.length; i++) {
            console.log('element');
            console.log(this.page.formComposition[i].container);
            let options = [];
            if (this.page.formComposition[i].options !== undefined) {
                options = JSON.parse(this.page.formComposition[i].options);
            }
            if(this.left_container !== undefined){
            this.createElement(
                this.page.formComposition[i].type,
                (this.page.formComposition[i].container === 'LEFT' ? 1 : 2),
                this.page.formComposition[i].labelTitle, i, options);   
            }
        }
    }
}

getFieldResponse(i) {
    const elt = this.formCandidate.nativeElement.querySelector('#fc' + i);
    if (elt !== undefined) {
        const component = this.form.pages[this.pageIndex].formComposition[i];
        const response = { label: '', value: '', type: '', pageIndex: 0, responseIndex: 0 };
        response.type = component.type;
        response.label = component.labelTitle;
        response.pageIndex = this.pageIndex;
        response.responseIndex = i;
        switch (component.type) {
            case 'single_line': {
                response.value = elt.value;
                break;
            }
            case 'phone': {
                response.value = elt.value;
                break;
            }
            case 'multi_line': {
                response.value = elt.value;
                break;
            }
            case 'url': {
                response.value = elt.value;
                break;
            }
            case 'date': {
                response.value = elt.value;
                break;
            }
            case 'file_upload': {
                response.value = elt.value;
                break;
            }
            case 'radio': {

                break;
            }
            case 'image': {

                break;
            }
            case 'checkbox': {

                break;
            }
            case 'text': {
                response.value = elt.value;
                break;
            }
            case 'email': {
                response.value = elt.value;
                break;
            }
            case 'number': {
                response.value = elt.value;
                break;
            }
            case 'description': {
                response.value = elt.value;
                break;
            }
            case 'decimal': {
                response.value = elt.value;
                break;
            }
            case 'multi_select': {
                response.value = elt.value;
                break;
            }
            case 'dropdown': {
                response.value = elt.options[elt.selectedIndex].value;
                break;
            }
            case 'note': {
                response.value = elt.value;
                break;
            }
            case 'percent': {
                response.value = elt.value;
                break;
            }
            case 'password': {
                response.value = elt.value;
                break;
            }

        }

        console.log('element ' + i);
        console.log('field response ');
        console.log(response);
        return response;

    }
}


setFieldResponse(i, value) {
    const elt = this.formCandidate.nativeElement.querySelector('#fc' + i);
    if (elt !== undefined) {
        const component = this.form.pages[this.pageIndex].formComposition[i];

        switch (component.type) {
            case 'single_line': {
                elt.value = value;
                break;
            }
            case 'phone': {
                elt.value = value;
                break;
            }
            case 'multi_line': {
                elt.value = value;
                break;
            }
            case 'url': {
                elt.value = value;
                break;
            }
            case 'date': {
                elt.value = value;
                break;
            }
            case 'file_upload': {
                elt.value = value;
                break;
            }
            case 'radio': {

                break;
            }
            case 'image': {
                elt.value = value;
                break;
            }
            case 'checkbox': {

                break;
            }
            case 'text': {
                elt.value = value;
                break;
            }
            case 'email': {
                elt.value = value;
                break;
            }
            case 'number': {
                elt.value = value;
                break;
            }
            case 'description': {
                elt.value = value;
                break;
            }
            case 'decimal': {
                elt.value = value;
                break;
            }
            case 'multi_select': {

                break;
            }
            case 'dropdown': {
                let options = [];
                if (component.options !== '' && component.options !== undefined) {
                    options = JSON.parse(component.options);
                }
                let valueIndex = 0;
                for (let j = 0; j < options.length; j++) {
                    if (options[j] === value) {
                        valueIndex = j;
                        break;
                    }
                }
                elt.selectedIndex = valueIndex;
                break;
            }
            case 'note': {
                elt.value = value;
                break;
            }
            case 'percent': {
                elt.value = value;
                break;
            }
            case 'password': {
                elt.value = value;
                break;
            }

        }



    }
}

getPageResponse() {
    const pageResponse: Array<{ label: string, value: string, type: string, pageIndex: number, responseIndex: number }> = [];
    for (let i = 0; i < this.elementCounter + 1; i++) {
        const response = this.getFieldResponse(i);
        const component = this.form.pages[this.pageIndex].formComposition[i];
        this.candidateResponse.response.push(response);
        if (component.role === 'lastname') {
            this.candidate.lastName = response.value;
        }
        if (component.role === 'firstname') {
            this.candidate.firstName = response.value;
        }
        if (component.role === 'college') {
            this.candidate.college = response.value;
        }
        if (component.role === 'phone') {
            this.candidate.phone = response.value;
        }
        if (component.role === 'email') {
            this.candidate.email = response.value;
        }
    }
    console.log('response ');
    console.log(this.candidateResponse.response);
    console.log('candidate');
    console.log(this.candidate);



}

next() {

    if (this.pageIndex < this.form.pages.length - 1) {
        console.log('form response');
        this.getPageResponse();
        this.pageIndex++;
        this.loadPage(this.pageIndex);
    } else {
        if(this.pageIndex === this.form.pages.length - 1){
            console.log('validate response');
            this.getPageResponse();
            console.log(this.candidateResponse);
            this.shouldShowCalendarPage = true;
            this.pageIndex ++ ; 
        }else{
            console.log('page index '+ this.pageIndex);
            
            // this.responseService.saveResponse(this.candidateResponse).then(
            //     () => {
            //         console.log('response saved');
            //         this.router.navigate(['/candutureSubmitted']);
            //     }
            // );
            
            
            this.router.navigate(['/candutureSubmitted']);

        }
        
    }
}

previous() {
    if (this.pageIndex > 0) {
        console.log('page index '+this.pageIndex); 
        this.pageIndex--;
        this.shouldShowCalendarPage = false;
        this.loadPage(this.pageIndex);
    }

}


 formateDate(date: Date) : Date{
    return new Date(date.getFullYear() , date.getMonth() , date.getDate());
}
  onNoClick(): void {
      this.confirm = false;
      this.dialogRef.close();

  }

}

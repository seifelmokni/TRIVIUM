import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { Candidate } from 'src/app/models/candidate/candidate.model';
import { CandidateService } from 'src/app/shared/candidate/candidate.service';
import { CandidateLog } from 'src/app/models/candidateLog/candidate-log.model';
import { LogService } from 'src/app/shared/log/log.service';
import { Logs, ISize } from 'selenium-webdriver';
import { MatDialog } from '@angular/material';
import { CreateTaskComponent } from '../popup/create-task/create-task.component';
import { Task } from 'src/app/models/tasks/task.model';
import { TaskService } from 'src/app/shared/task/task.service';
import { AuthService } from 'src/app/shared/auth/auth.service';
import { ResponseService } from 'src/app/shared/response/response.service';
import { FormsService } from 'src/app/shared/forms/forms.service';
import { Response } from 'src/app/models/response/response.model';
import { Form } from 'src/app/models/form/form.model';
import { fromEvent } from 'rxjs';
import { Element } from 'src/app/models/element/element.model';

@Component({
  selector: 'app-candidate-information',
  templateUrl: './candidate-information.component.html',
  styleUrls: ['./candidate-information.component.css']
})
export class CandidateInformationComponent implements OnInit {
  candidate: Candidate;
  editModeEnabled = false;
  editPersonalInfoModeEnabled= false;
  editEducationInfoModeEnabled = false ; 
  hq;
  fixPhone;
  phone;
  email;
  emailUnav;
  province;
  city;
  birthDate;

  firstName;
  lastName;
  secondName;
  nationality;
  secondEmail;
  dni;

  eso4AverageGrade;
  eso4Province;
  eso4Population;
  eso4Center;
  college;
  step;
  carrer;

  eso3AverageGrade;
  eso3Province;
  eso3Population;
  eso3Center;

  bachAverageGrade;
  bachProvince;
  bachPopulation;
  bachCenter;
  isSingleColumnForm = false;
  showResponseSection = false;

  logs: Array<{day: string , logs: CandidateLog[]}> = [] ; 
  sectionSelected = 'resume';
  tasks:Task[];
  allTasks:Task[];
  forms: Form[] = [];
  responses : Map<number , Response>  = new Map();
  elementCounter = 0 ; 
  pageIndex = 0;
  formSelected : Form ; 
  index = 0 ; 

  @ViewChild('left_container') left_container: ElementRef;
  @ViewChild('right_container') right_container: ElementRef


  constructor(private candidateService: CandidateService , 
    private logService: LogService ,
    private dialog: MatDialog,
    private taskService: TaskService , 
    private authService: AuthService,
    private responseService: ResponseService , 
    private formService: FormsService,
    private elementRef: ElementRef) { }
    

  ngOnInit() {
    this.candidate = this.candidateService.selectedCandidate ;
    this.taskService.listTask(this.candidate.candidateId).subscribe(
      (t:Task[]) => {
        this.tasks = t.reverse();
        if(this.tasks.length != 0){
            this.tasks = [this.tasks[0]];
            this.allTasks  = t.reverse() ; 
        }
        
      }
    );
    this.logService.listCandidateLogs(this.candidate.candidateId).subscribe(
        (logs: CandidateLog[]) => {
            
          console.log('db logs');
          console.log(logs);
          this.logs = [] ; 
          for(let i = 0 ; i < logs.length ; i++){
            let found = false ; 
            /*for(let j = 0 ; j < this.logs.length ; j++){
                let d = logs[i].logDate;
                const ds= d.split('-') ; 
                d=  ds[2]+'-'+(parseInt(ds[1]) < 10 ? '0'+ds[1] : ds[1])+'-'+ds[0] ; 
              
                let d1 = this.logs[j].day;
                const ds1= d.split('-') ; 
                d1=  ds1[2]+'-'+(parseInt(ds1[1]) < 10 ? '0'+ds1[1] : ds1[1])+'-'+ds1[0] ; 
              if(d == d1){
                found = true ;
                if(this.logs[j].logs.length == 0){
                  this.logs[j].logs = [] ; 
                }
                this.logs[j].logs.push(logs[i]);
              }
            }*/
            if(!found){
                let d = logs[i].logDate;
                const ds= d.split('-') ; 
                d=  ds[2]+'-'+(parseInt(ds[1]) < 10 ? '0'+ds[1] : ds[1])+'-'+ds[0] ; 
              this.logs.push({day: d , logs : [logs[i]]});
            }
          }
         // this.logs = this.logs.reverse();
          console.log('logs ') ; 
          console.log(this.logs);
        }
      );

    this.responseService.listCandidateResponse(this.candidate.candidateId).subscribe(
      (r: Response[]) => {
        for(let i = 0 ; i < r.length ; i++){
         const formId= r[i].formId;
         this.formService.getForm(formId).subscribe(
           (forms: Form[]) => {
             console.log('form');
             console.log(forms);
             let f = forms[0] ; 
             if(f.isRegisterForm){
                 
             }
             this.forms.push(forms[0]);
             this.responses.set(i , r[i]);
           }
         );
        }

      }
    )
  }

  editButtonClicked(){
    if(this.editModeEnabled){
      this.candidate.email = this.email != undefined ? this.email : '';
      this.candidate.fixPhone = this.fixPhone != undefined ? this.fixPhone : '';
      this.candidate.phone = this.phone != undefined ? this.phone : '' ; 
      this.candidate.hq = this.hq != undefined ? this.hq : '' ; 
      this.candidate.birthDate = this.birthDate != undefined ? this.birthDate : '';
      this.candidateService.updateCandidate(this.candidate).then(
        () => {
          this.editModeEnabled = false;
           
        const log = new CandidateLog(); 
        log.author = this.authService.getUserSession() ;  

        log.logCandidateId = this.candidate.candidateId ; 
        log.logType = 'edit-resume-info'; 
        this.logService.saveCandidateLog(log) ; 
        }
      ) ; 
    }else{
      this.email = this.candidate.email;
      this.phone = this.candidate.phone;
      this.hq = this.candidate.hq;
      this.fixPhone = this.candidate.fixPhone;
      this.birthDate = this.candidate.birthDate != undefined ? this.candidate.birthDate : '2000-01-01';
      this.editModeEnabled = true;
    }
  }

  editPersonalInfoButtonClicked(){
    if(this.editPersonalInfoModeEnabled){
      this.candidate.firstName = this.firstName != undefined ? this.firstName : '';
      this.candidate.secondName = this.secondName != undefined ? this.secondName : '' ;
      this.candidate.lastName = this.lastName != undefined ? this.lastName : '' ; 
      this.candidate.email = this.email != undefined ? this.email : '';
      this.candidate.nationality = this.nationality != undefined ? this.nationality : '';
      this.candidate.secondEmail = this.secondEmail != undefined ? this.secondEmail : '';
      this.candidate.dni = this.dni != undefined ? this.dni : '' ; 
      this.candidateService.updateCandidate(this.candidate).then(
        () => {
          this.editPersonalInfoModeEnabled = false;
           
        const log = new CandidateLog(); 
        log.author = this.authService.getUserSession() ;  

        log.logCandidateId = this.candidate.candidateId ; 
        log.logType = 'edit-personal-info'; 
        this.logService.saveCandidateLog(log) ; 
        }
      )

    }else{
      this.email = this.candidate.email ; 
      this.firstName = this.candidate.firstName;
      this.secondName = this.candidate.secondName;
      this.lastName = this.candidate.lastName;
      this.nationality = this.candidate.nationality;
      this.secondEmail = this.candidate.secondEmail;
      this.dni = this.candidate.dni;
      this.editPersonalInfoModeEnabled = true;
    }

  }

  editEdutioncaButtonClicked(){
    if(this.candidate.education == undefined){
      this.candidate.education = [] ; 
    }
    if(this.editEducationInfoModeEnabled){
      let eso3 :{id:string , averageGrade: string , province:string , population:string, center:string} =
      {
        id: 'eso3',
        averageGrade : this.eso3AverageGrade,
        province : this.eso3Province,
        population : this.eso3Population,
        center : this.eso3Center
    };
    if(this.candidate.education[0] != undefined){
      this.candidate.education[0] = eso3 ;
    }else{
      this.candidate.education.push(eso3);
    }

    let bach :{id:string , averageGrade: string , province:string , population:string, center:string} =
      {
        id: 'bach',
        averageGrade : this.bachAverageGrade,
        province : this.bachProvince,
        population : this.bachPopulation,
        center : this.bachCenter
    };
    if(this.candidate.education[1] != undefined){
      this.candidate.education[1] = bach ;
    }else{
      this.candidate.education.push(bach);
    }

    let eso4 :{id:string , averageGrade: string , province:string , population:string, center:string} =
      {
        id: 'eso4',
        averageGrade : this.eso4AverageGrade,
        province : this.eso4Province,
        population : this.eso4Population,
        center : this.eso4Center
    };
    if(this.candidate.education[2] != undefined){
      this.candidate.education[2] = eso4 ;
    }else{
      this.candidate.education.push(eso4);
    }
    console.log("candidate"); 
    console.log(this.candidate);
    this.candidateService.updateCandidate(this.candidate).then(
      () => {
        this.editEducationInfoModeEnabled  = false ; 
        const log = new CandidateLog(); 
        log.author = this.authService.getUserSession() ;  

        log.logCandidateId = this.candidate.candidateId ; 
        log.logType = 'edit-education-info'; 
        this.logService.saveCandidateLog(log) ; 
      }
    );



    }else{
      
      this.eso3AverageGrade = this.candidate.education[0] != undefined ? this.candidate.education[0].averageGrade  : '';
      this.eso3Province = this.candidate.education[0] != undefined ? this.candidate.education[0].province : '' ; 
      this.eso3Population = this.candidate.education[0] != undefined ? this.candidate.education[0].population : '' ;
      this.eso3Center = this.candidate.education[0]  != undefined ? this.candidate.education[0].center : '' ;

      this.bachAverageGrade = this.candidate.education[1] != undefined ? this.candidate.education[1].averageGrade : '';
      this.bachProvince = this.candidate.education[1] != undefined ? this.candidate.education[1].province : '' ; 
      this.bachPopulation = this.candidate.education[1] != undefined ? this.candidate.education[1].population  : '' ; 
      this.bachCenter = this.candidate.education[1] != undefined ? this.candidate[1].center : '' ; 

      this.eso4AverageGrade = this.candidate.education[2] != undefined ? this.candidate.education[2].averageGrade : '' ; 
      this.eso4Province = this.candidate.education[2] != undefined ? this.candidate.education[2].province : '' ; 
      this.eso4Population = this.candidate.education[2] != undefined ? this.candidate.education[2].population : '' ; 
      this.eso4Center = this.candidate.education[2] != undefined ? this.candidate.education[2].center : '' ; 
      
      this.editEducationInfoModeEnabled = true ;

    }

  }

  cancelEdition(){
    this.editModeEnabled =  false;
    this.editPersonalInfoModeEnabled =false;
  }

  changeSection(section){
    console.log('section selected '+section) ; 
    console.log(this.candidate) ; 
    if(section == 'chronology'){
      
    }
    this.sectionSelected = section ;
    this.showResponseSection= false; 
    console.log(section); 
    for(let i = 0 ; i < this.forms.length ; i ++){
      if(section == this.forms[i].title){
        this.showResponseSection = true ; 
        this.formSelected = this.forms[i];
        this.index = i;
        this.buildFormWithResponse(this.formSelected , this.pageIndex , this.responses.get(i)) ; 
      }
    }
     

  }

  next(){
    if(this.pageIndex < this.formSelected.pages.length){
      this.elementCounter =0 ; 
      this.pageIndex ++; 
      this.left_container.nativeElement.innerHTML = '' ; 
      this.right_container.nativeElement.innerHTML = '' ; 
      this.buildFormWithResponse(this.formSelected , this.pageIndex , this.responses.get(this.index));
    }
  }

  previous(){
    if(this.pageIndex > 0){
      this.pageIndex --; 
      this.elementCounter =0 ; 
      this.left_container.nativeElement.innerHTML = '' ; 
      this.right_container.nativeElement.innerHTML = '' ; 
      this.buildFormWithResponse(this.formSelected , this.pageIndex , this.responses.get(this.index));
    }
  }


  buildFormWithResponse(form:Form , pageIndex: number , response: Response){

    for(let i = 0 ; i < form.pages[pageIndex].formComposition.length ; i++){
      let element= form.pages[pageIndex].formComposition[i] ; 
      let value = '';
      for(let j = 0 ; j < response.response.length ; j++){
        if(response.response[j].label == element.labelTitle){
          value = response.response[j].value ; 
          break ; 
        }
      }
      let options = element.options ; 
      let opts;
      if(options == undefined){
        opts = [] ; 
      }else{
        opts = JSON.parse(options) ; 
      }
      this.createElement(element.type ,
         (element.container == 'LEFT' ?  1 : 2) ,
          element.labelTitle ,
          this.elementCounter ,
          opts ,
          element ,
          value);
          this.elementCounter++ ; 
    }
  }

  createElement(type: string, container, labelTitle: string, index: number, values: Array<string> , element: Element , value:string) {
    this.elementCounter = index;
    console.log('type is ' + type);
    let div = '';
    
    switch (type) {
        case 'title': {
            div = '<div class="two-col dynamic" tabindex="0" style="opacity: 1; background: none; display: block !important" draggable="true"' +
            ' id="el-' + this.elementCounter + '"  >';
            break ; 
        }
        case 'section': {
            div = '<div class="two-col dynamic" tabindex="0" style="opacity: 1; background: rgb(105, 21, 27); display: block !important" draggable="true"' +
            ' id="el-' + this.elementCounter + '"  >';
            break ; 
        }
        case '2_line_text' :{
            div = '<div class="two-col dynamic" tabindex="0" style="opacity: 1; background: none; display:grid;" draggable="true"' +
            ' id="el-' + this.elementCounter + '"  >';
            break ; 
        } 
        case 'paragraph': {
            div = '<div class="two-col dynamic" tabindex="0" style="opacity: 1; background: none; display: block !important" draggable="true"' +
            ' id="el-' + this.elementCounter + '" >';
            break ; 
        }
        case 'youtube': {
            div = '<div class="two-col dynamic" tabindex="0" style="opacity: 1; background: none; padding-left: 26%" draggable="true"' +
            ' id="el-' + this.elementCounter + '" >';
            break;
        }
        default : {
            div = '<div class="two-col dynamic" tabindex="0" style="opacity: 1; background: none;" draggable="true"' +
            ' id="el-' + this.elementCounter + '" >';
            break ; 
        }
    }
    switch (type) {
        case 'single_line': {
            div += '<label id="lbl-' + this.elementCounter + '" style="height:37px" >' + (labelTitle === undefined ? 'Single Line' : labelTitle) +
                '</label>' +
                '<input type="text" id="fc' + this.elementCounter + '"  name="singleLine" style="display:none" />';

            break;
        }
        case 'phone': {
            div += '<label id="lbl-' + this.elementCounter + '" >' + (labelTitle === undefined ? 'phone' : labelTitle) + '</label>' +
                '<input type="tel" id="fc' + this.elementCounter + '" name="phone" value="'+value+'" />';


            break;
        }
        case 'multi_line': {
            div += '<label for="" id="lbl-' + this.elementCounter + '" >' + (labelTitle === undefined ? 'Multi line' : labelTitle) +
                '</label>' +
                '<textarea id="fc' + this.elementCounter + '" name="multiLine" cols="25" rows="5" defaultvalue="" value="'+value+'"></textarea>';


            break;
        }
        case 'url': {
            div += '<label for="" id="lbl-' + this.elementCounter + '" >' + (labelTitle === undefined ? 'url' : labelTitle) +
                '</label>' + '<input type="url" id="fc' + this.elementCounter + '" name="url"  value="'+value+'"/>';


            break;
        }
        case 'date': {
            div += '<label for="" id="lbl-' + this.elementCounter + '" >' + (labelTitle === undefined ? 'date' : labelTitle) +
                '</label>' + '<input type="date" id="fc' + this.elementCounter + '" name="date" value="'+value+'" />';


            break;
        }
        case 'file_upload': {
            div += '<label for="" id="lbl-' + this.elementCounter + '" >' + (labelTitle === undefined ? 'File' : labelTitle) +
                '</label>' + '<input type="file" id="fc' + this.elementCounter + '" name="fileUpload" />';


            break;
        }
        case 'radio': {
            div += '<label for="" id="lbl-' + this.elementCounter + '" >' + (labelTitle === undefined ? 'Radio' : labelTitle) +
                '</label>' +
                '<div id="rd-' + this.elementCounter + '">';
            for (let i = 0; i < values.length; i++) {
                if(values[i] !== ''){
                    div += '<p>' +
                    '<input type="radio" name="checkbox" id="fc' + this.elementCounter + '-1" ' +
                    ' value="checkbox 1" checked="'+(values[i] == value)+'"><label for="radio1">' + values[i] + '</label>' +
                    '</p>';
                }
            }

            div += '</div>';


            break;
        }
        case 'image': {
            div += '<label for="" id="lbl-' + this.elementCounter + '" >' + (labelTitle === undefined ? 'image' : labelTitle) +
                '</label>' + '<input type="file" id="fc' + this.elementCounter + '" name="image" />';


            break;
        }
        case 'checkbox': {
            div += '<label for="" id="lbl-' + this.elementCounter + '" >' + (labelTitle === undefined ? 'Radio' : labelTitle) +
                '</label>' +
                '<div id="cb-' + this.elementCounter + '">';
            for (let i = 0; i < values.length; i++) {
                if(values[i] !== ''){
                    div += '<p>' +
                    '<input type="checkbox" name="checkbox" id="fc' + this.elementCounter + '-1" ' +
                    ' value="checkbox 1"><label for="radio1">' + values[i] + '</label>' +
                    '</p>';
                }
            }

            div += '</div>';


            break;
        }
        case 'text': {
            div += '<label for="" id="lbl-' + this.elementCounter + '" >' + (labelTitle === undefined ? 'text' : labelTitle) +
                '</label>' + '<input type="text" id="fc' + this.elementCounter + '" name="text" value="'+value+'" />';


            break;
        }
        case 'email': {
            div += '<label for="" id="lbl-' + this.elementCounter + '" >' + (labelTitle === undefined ? 'email' : labelTitle) +
                '</label>' + '<input type="email" id="fc' + this.elementCounter + '" name="email" value="'+value+'" />';


            break;
        }
        case 'number': {
            div += '<label for="" id="lbl-' + this.elementCounter + '" >' + (labelTitle === undefined ? 'number' : labelTitle) +
                '</label>' + '<input type="number" id="fc' + this.elementCounter + '" name="number" value="'+value+'" />';


            break;
        }
        case 'description': {
            div += '<label for="" id="lbl-' + this.elementCounter + '" >' + (labelTitle === undefined ? 'description' : labelTitle) +
                '</label>' +
                '<textarea id="fc' + this.elementCounter + '" name="description" cols="25" rows="5" value="'+value+'"></textarea>';


            break;
        }
        case 'decimal': {
            div += '<label for="" id="lbl-' + this.elementCounter + '" >' + (labelTitle === undefined ? 'Decimal' : labelTitle) +
                '</label>' + '<input type="text" id="fc' + this.elementCounter + '" name="decimal" value="'+value+'" />';


            break;
        }
        case 'multi_select': {
            div += '<label for="" id="lbl-' + this.elementCounter + '" >' + (labelTitle === undefined ? 'Multi select' : labelTitle) +
                '</label>' +
                '<select multiple="" id="fc' + this.elementCounter + '" name="multiSelect">' +
                '<option value="">--por favor, elija--</option></select>';


            break;
        }
        case 'dropdown': {
            div += '<label for="" id="lbl-' + this.elementCounter + '" >' + (labelTitle === undefined ? 'Dropdown' : labelTitle) +
                '</label>' +
                '<select id="sel-' + this.elementCounter + '" name="dropdown"><option value="">--por favor, elija--</option></select>';

            break;
        }
        case 'note': {
            div += '<label for="" id="lbl-' + this.elementCounter + '" >' + (labelTitle === undefined ? 'Note' : labelTitle) +
                '</label>' +
                '<textarea id="fc' + this.elementCounter + '" name="note" cols="25" rows="5" value="'+value+'"></textarea>';


            break;
        }
        case 'percent': {
            div += '<label for="" id="lbl-' + this.elementCounter + '" >' + (labelTitle === undefined ? 'Percent' : labelTitle) +
                '</label>' +
                '<input type="text" id="fc' + this.elementCounter + '" name="percent" value="'+value+'" />';


            break;
        }
        case 'password': {
            div += '<label for="" id="lbl-' + this.elementCounter + '" >' + (labelTitle === undefined ? 'Password' : labelTitle) +
                '</label>' +
                '<input type="password" id="fc' + this.elementCounter + '" name="percent" value="'+value+'" />';
            break;
        }
        case 'white_space': {
            div += '<label class="whitespace" id="lbl-' + this.elementCounter + '" style="height: 20px;">  </label>';
            div += '<span > </span>';
            break;
        }case 'photo' : {
            const src = (element.value !== '' ? element.value : 'https://vignette.wikia.nocookie.net/the-darkest-minds/images/4/47/Placeholder.png/revision/latest?cb=20160927044640');
            let mapLoadedImage = (event): ISize => {
                return {
                    width: event.target.width,
                    height: event.target.height
                };
            }
            const image = new Image(); 
            const index = this.elementCounter ; 
            let imageLoaded = fromEvent(image  , 'load').map(mapLoadedImage) ;
            imageLoaded.subscribe(response => {
            console.log("observable ") ; 
            console.log(response) ; 
            this.elementRef.nativeElement.querySelector('#src-'+index).style = '';
            if(response.width > 1000){
                this.elementRef.nativeElement.querySelector('#src-'+index).width = 1000;
                this.elementRef.nativeElement.querySelector('#src-'+index).height = 800 ; 
            }
            this.elementRef.nativeElement.querySelector('#src-'+index).src = image.src ; 
        });
            
            image.src = src ; 
            const tmpSrc = 'https://vignette.wikia.nocookie.net/the-darkest-minds/images/4/47/Placeholder.png/revision/latest?cb=20160927044640' ; 
            div +='<label id="lbl-' + this.elementCounter + '" style="display:none"></label>';
            div += '<img class="image-container" id="src-' + this.elementCounter + '" src="'+tmpSrc
            +'"  style="width: 300px !important; height: 300px !important; margin-left: 30% !important"   /> ' ;
            break;
        }
        case 'video' : {
            div +='<label id="lbl-' + this.elementCounter + '" style="display:none"></label>';
            div += '<video id="src-' + this.elementCounter + '" src="'+element.value+'" width="100%"  style="background: #d6d6d6;"> </video> ' ;
            break;
        }
        case 'title' : {
            div +='<label id="lbl-' + this.elementCounter + '" style="font-size: 25px; font-weight: bold;">' + (labelTitle === undefined ? 'Title' : labelTitle) +
            '</label>';
            div += '<input type="text" style="display: none"> </video> ' ;
            break;
        }
        case 'section' : {
            div +='<label id="lbl-' + this.elementCounter + '" style="font-size: 20px; font-weight: bold; color: #FFF">' + (labelTitle === undefined ? 'Title' : labelTitle) +
            '</label>';
            div += '<input type="text" style="display: none"> </video> ' ;
            break;
        }
        case 'paragraph' : {
            div +='<p id="lbl-' + this.elementCounter + '" >' + (labelTitle === undefined ? 'Paragraph' : labelTitle) +
            '</p>';
            div += '<input type="text" style="display: none"> </video> ' ;
            break;
        }
        case 'youtube' : {
            div +='<label id="lbl-' + this.elementCounter + '" style="display:none"></label>';
            div += '<iframe id="src-' + this.elementCounter +'" width="420" height="315" src="'+element.value+'"></iframe>' ;
            break;
            
        }
        case '2_line_text' : {
            div += '<label for="" id="lbl-' + this.elementCounter + '" >' + (labelTitle === undefined ? 'text' : labelTitle) +
                '</label><br><small id="sm-'+this.elementCounter+'">'+element.value+'</small><br>' 
                + '<input type="'+(element.inputType != undefined ? element.inputType : 'text')+'" id="fc' + this.elementCounter + '" name="text" />';
            break;

        }

    }
    let path = '';
    if (container === 1) {
        path = '<i class="fa fa-pencil"></i>';
    } else {
        path = '<i class="fa fa-pencil"></i>';
    }

    div += '<span style="display: '+(type !== 'youtube' ? 'none' : 'none')+';">' +
        '<a title="Mover a la derecha" id="move-' + this.elementCounter + '" style="display: '+(type !== 'youtube' ? 'none' : 'none')+';">' +
        '<i class="fas fa-pencil-alt"></i>' +
        '</a>' +
        '<a title="Borrar" id="delete-' + this.elementCounter + '">' +
        '<i class="fa fa-trash-alt"></i></a>'+
        '</span>';
    div += '</div>';
    if (container === 1) {
        this.left_container.nativeElement.insertAdjacentHTML('beforeEnd', div);
    } else {
        this.right_container.nativeElement.insertAdjacentHTML('beforeEnd', div);

    }
    /*
    if (this.elementRef.nativeElement.querySelector('#fc' + this.elementCounter)) {
        this.elementRef.nativeElement.querySelector('#fc' + this.elementCounter).addEventListener('change',
            (event) => this.formInputValueChanged(this.elementCounter, type, this.page.conditions));

    } else {
        for (let i = 0; i < values.length; i++) {
            if(values[i] !== ''){
                if(this.elementRef.nativeElement.querySelector('#fc' + this.elementCounter + '-' + i) != null){
                    this.elementRef.nativeElement.querySelector('#fc' + this.elementCounter + '-' + i).addEventListener('change',
                    (event) => this.formInputValueChanged(this.elementCounter, type, this.page.conditions));    
                }
            }
        }
    } */
}


  createNewTask(){
    const dialogRef = this.dialog.open(CreateTaskComponent, {
      width: '300px',
      data: {task: new Task()  }
  });

  dialogRef.afterClosed().subscribe(result => {
      if (result !== '') {
        
          console.log('The dialog was closed');
          console.log(result);
          let task: Task = result as Task;
          task.candidateID = this.candidate.candidateId;
          task.assigner = this.authService.getUserSession();

          this.taskService.saveTask(task).then(
            ()=>{
              let log = new CandidateLog();
              log.author = this.authService.getUserSession() ;  

              log.logCandidateId = this.candidate.candidateId ; 
              log.logType = 'create-new-task';
              log.logContent = task.taskContent ;  
              this.logService.saveCandidateLog(log) ; 
            }
          );
      }

  });
  }

  closeTaks(t:Task){
    t.isClosed = true;
    this.taskService.updateTask(t);
  }

  reassignTask(t:Task){

    const dialogRef = this.dialog.open(CreateTaskComponent, {
      width: '300px',
      data: {task: t}
  });

  dialogRef.afterClosed().subscribe(result => {
      if (result !== '') {
          t.isClosed = false; 
          console.log('The dialog was closed');
          console.log(result);
          this.taskService.updateTask(t).then(
            () => {
              let task: Task = result as Task;
              task.candidateID = this.candidate.candidateId;
              task.assigner = this.authService.getUserSession();
              this.taskService.saveTask(task).then(
                ()=>{
                  let log = new CandidateLog();
                  log.logCandidateId = this.candidate.candidateId ; 
                  log.logType = 'create-new-task';
                  log.logContent = task.taskContent ; 
                  log.author = this.authService.getUserSession() ;  
                  this.logService.saveCandidateLog(log) ; 
                }
              );
            }
          );
         
         
      }

  });
  }

}

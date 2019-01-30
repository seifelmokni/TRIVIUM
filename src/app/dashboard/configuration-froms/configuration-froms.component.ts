import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Form } from 'src/app/models/form/form.model';
import { FormsService } from 'src/app/shared/forms/forms.service';
import { ModelsService } from 'src/app/shared/models/models.service';
import { Model } from 'src/app/models/model/model.model';
import { PlatformLocation } from '@angular/common';
import { Links } from 'src/app/models/links/links.model';
import { LinksService } from 'src/app/shared/Links/links.service';

@Component({
  selector: 'app-configuration-froms',
  templateUrl: './configuration-froms.component.html',
  styleUrls: ['./configuration-froms.component.css']
})
export class ConfigurationFromsComponent implements OnInit {
  @ViewChild('beginingFormSelector') beginingFormSelector: ElementRef;
  @ViewChild('preInterviewFormSelector') preInterviewFormSelector: ElementRef;
  @ViewChild('interviewFormSelector') interviewFormSelector: ElementRef ; 
  @ViewChild('formSelector') formSelector: ElementRef ; 
  @ViewChild('linkToCopy') linkToCopy: ElementRef ; 


  @ViewChild('beginingFormModelSelector') beginingFormModelSelector: ElementRef;
  @ViewChild('preInterviewFormModelSelector') preInterviewFormModelSelector: ElementRef;
  @ViewChild('interviewFormModelSelector') interviewFormModelSelector: ElementRef ; 
  forms: Form[];
  availbleForms: Form[];
  models: Model[] ; 

  beginingModelId= '';
  preInterviewModelId = ''
  interviewModelId = '' ; 

  registerFormLink= '' ; 
  preInterviewFormLink = '' ; 
  interviewFormLink = '' ; 
  showNewLinkRow = false ; 
  copied = false ; 
  link='';
  links : Links[] = [] ; 
  index = 0 ; 

  constructor(
    private formService: FormsService ,
    private modelSerivce: ModelsService,
    private plateformLocation: PlatformLocation,
    private elementRef: ElementRef ,
    private linkService: LinksService
    ) { }

  ngOnInit() {
    this.formService.listForms().subscribe(
      (f:Form[]) => {
        this.forms = f;
        this.availbleForms = f; 
        for(let i = 0 ; i < f.length ; i++){
          if(f[i].isRegisterForm){
            this.beginingModelId = f[i].modelToSendId ; 
            this.registerFormLink = (this.plateformLocation as any).location.origin+'/submitCandidature/'+f[i].formId ;

          }
          if(f[i].isPreInterviewForm){
            this.preInterviewModelId = f[i].modelToSendId ; 
            this.preInterviewFormLink = (this.plateformLocation as any).location.origin+'/submitCandidature/'+f[i].formId ;

          }
          if(f[i].isInterviewForm){
            this.interviewModelId = f[i].modelToSendId ; 
            this.interviewFormLink = (this.plateformLocation as any).location.origin+'/submitCandidature/'+f[i].formId ;

          }
        }
      }
    );
    this.modelSerivce.listModels().subscribe(
      (m:Model[]) => {
        this.models = m ; 
      }
    );
    this.linkService.list().subscribe(
      (l:Links[]) => {
        this.links = l ; 
      }
    )
  }

  setFormModel( step: number){
    let id= '' ; 
    if(step == 0){
      id = this.beginingFormModelSelector.nativeElement.options[this.beginingFormModelSelector.nativeElement.selectedIndex].value;
      if(id !='-1'){
        this.beginingModelId = id ; 
        for(let i = 0 ;i < this.forms.length ; i ++){
          if(this.forms[i].isRegisterForm){
            this.forms[i].modelToSendId= id ; 
          }
        }
      }
    }
    if(step == 1){
      id = this.preInterviewFormModelSelector.nativeElement.options[this.preInterviewFormModelSelector.nativeElement.selectedIndex].value;
      if(id !='-1'){
        this.preInterviewModelId = id ; 
        for(let i = 0 ;i < this.forms.length ; i ++){
          if(this.forms[i].isPreInterviewForm){
            this.forms[i].modelToSendId= id ; 
          }
        }
      }
    }
    if(step == 2){
      id = this.interviewFormModelSelector.nativeElement.options[this.interviewFormModelSelector.nativeElement.selectedIndex].value;
      if(id !='-1'){
        this.interviewModelId = id ; 
        for(let i = 0 ;i < this.forms.length ; i ++){
          if(this.forms[i].isInterviewForm){
            this.forms[i].modelToSendId= id ; 
          }
        }
      }
    }

    for(let i = 0 ; i < this.forms.length ;i ++){
      console.log('update form') ; 
      console.log(this.forms[i]) ; 
      this.formService.update(this.forms[i]);
    }


  }
  
  setFormType( step : number) {
    
    let id = '';

    if(step == 0){
      // is beginning form
       id = this.beginingFormSelector.nativeElement.options[this.beginingFormSelector.nativeElement.selectedIndex].value ;
      if(id != '-1'){
        let form: Form;
        for(let i = 0 ; i < this.forms.length ; i++){
          if(this.forms[i].formId == id){
            form = this.forms[i] ; 
          }
          this.forms[i].isRegisterForm = false;
        }
        this.registerFormLink = (this.plateformLocation as any).location.origin+'/submitCandidature/'+form.formId ;

        form.isRegisterForm = true;
        form.isInterviewForm = false; 
        form.isInterviewForm = false;  
      }
    }
    if(step == 1){
      // is pre interview form
       id = this.preInterviewFormSelector.nativeElement.options[this.preInterviewFormSelector.nativeElement.selectedIndex].value ;
      if(id != '-1'){
        let form: Form;
        for(let i = 0 ; i < this.forms.length ; i++){
          if(this.forms[i].formId == id){
            form = this.forms[i] ; 
          }
          this.forms[i].isPreInterviewForm = false;
        }
      this.preInterviewFormLink = (this.plateformLocation as any).location.origin+'/submitCandidature/'+form.formId ;
      form.isPreInterviewForm = true;
      form.isRegisterForm = false; 
      form.isInterviewForm = false ; 
    }
    }
     id = this.interviewFormSelector.nativeElement.options[this.interviewFormSelector.nativeElement.selectedIndex].value ;
      if(id != '-1'){
        let form: Form;
    if(step == 2){
      for(let i = 0 ; i < this.forms.length ; i++){
        if(this.forms[i].formId == id){
          form = this.forms[i] ; 
        }
        this.forms[i].isInterviewForm = false;

      }
      this.interviewFormLink = (this.plateformLocation as any).location.origin+'/submitCandidature/'+form.formId ;

      form.isInterviewForm = true;
      form.isRegisterForm = false ; 
      form.isPreInterviewForm= false;
    }
  }


    

    for(let i = 0 ; i < this.forms.length ;i ++){
      console.log('update form') ; 
      console.log(this.forms[i]) ; 
      this.formService.update(this.forms[i]);
    }

  }


  selectNormalForm(i){
    const formSelector = this.elementRef.nativeElement.querySelector('#formSelector-'+i) ; 
    if(formSelector != undefined){
      const id = formSelector.options[formSelector.selectedIndex].value ; 
      if(id != '-1'){
       this.links[i].links = (this.plateformLocation as any).location.origin+'/submitCandidature/'+id;
       this.linkService.save(this.links[i]) ; 
      }
    }
    this.copied = false ; 
    
  }

  deleteRow(i){
    this.linkService.delete(this.links[i]) ; 
  }

  copyLink(i){
    let selBox = document.createElement('textarea');
    selBox.style.position = 'fixed';
    selBox.style.left = '0';
    selBox.style.top = '0';
    selBox.style.opacity = '0';
    selBox.value = this.links[i].links;
    document.body.appendChild(selBox);
    selBox.focus();
    selBox.select();
    document.execCommand('copy');
    document.body.removeChild(selBox);
    this.elementRef.nativeElement.querySelector('#checked-'+i).style = "display:content";
  

  }

  addLink(){
    console.log('adding link');
    const l = new Links() ; 
    this.links.push(l) ; 
  }


  



}

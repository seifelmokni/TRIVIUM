import { Component, OnInit, ViewChild, ElementRef, Renderer2, ChangeDetectorRef } from '@angular/core';
import { Form } from 'src/app/models/form/form.model';
import { Page } from 'src/app/models/page/page.model';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Candidate } from 'src/app/models/candidate/candidate.model';
import { Element } from 'src/app/models/element/element.model';
import { ISize } from 'selenium-webdriver';
import { fromEvent } from 'rxjs';
import { FormsService } from 'src/app/shared/forms/forms.service';
import { ResponseService } from 'src/app/shared/response/response.service';
import { Router, ActivatedRoute } from '@angular/router';
import { CandidateService } from 'src/app/shared/candidate/candidate.service';
import { ConfigurationService } from 'src/app/shared/configuration/configuration.service';
import { AuthService } from 'src/app/shared/auth/auth.service';
import { Response } from 'src/app/models/response/response.model';

@Component({
  selector: 'app-candidate-responses',
  templateUrl: './candidate-responses.component.html',
  styleUrls: ['./candidate-responses.component.css']
})
export class CandidateResponsesComponent implements OnInit {
    @ViewChild('left_container') left_container: ElementRef;
    @ViewChild('right_container') right_container: ElementRef;
    @ViewChild('formCandidate') formCandidate: ElementRef;
    elementCounter = 0;
    forms: Form[];
    form: Form;
    page: Page;
    pageIndex = 0;
    isSingleColumnForm: Boolean = false ;

    condidateForm: FormGroup;
    candidateResponse: Response;
    candidate: Candidate;
    pageRequiredFields: Array<number>;
    pageNotRequiredFields: Array<number>;
    

  constructor( private elementRef: ElementRef,
    private formService: FormsService,
    private formBuilder: FormBuilder,
    private renderer: Renderer2,
    private responseService: ResponseService,
    private router: Router,
    private route: ActivatedRoute,
    private candidateService: CandidateService,
    private configService: ConfigurationService,
    private authService: AuthService,
    private changeDectector : ChangeDetectorRef ,
) { }

  ngOnInit() {
  }
  createElement(type: string, container, labelTitle: string, index: number, values: Array<string> , element: Element) {
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
                '<input type="tel" id="fc' + this.elementCounter + '" name="phone" />';


            break;
        }
        case 'multi_line': {
            div += '<label for="" id="lbl-' + this.elementCounter + '" >' + (labelTitle === undefined ? 'Multi line' : labelTitle) +
                '</label>' +
                '<textarea id="fc' + this.elementCounter + '" name="multiLine" cols="25" rows="5" defaultvalue=""></textarea>';


            break;
        }
        case 'url': {
            div += '<label for="" id="lbl-' + this.elementCounter + '" >' + (labelTitle === undefined ? 'url' : labelTitle) +
                '</label>' + '<input type="url" id="fc' + this.elementCounter + '" name="url" />';


            break;
        }
        case 'date': {
            div += '<label for="" id="lbl-' + this.elementCounter + '" >' + (labelTitle === undefined ? 'date' : labelTitle) +
                '</label>' + '<input type="date" id="fc' + this.elementCounter + '" name="date" />';


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
                    ' value="checkbox 1"><label for="radio1">' + values[i] + '</label>' +
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
                '</label>' + '<input type="text" id="fc' + this.elementCounter + '" name="text" />';


            break;
        }
        case 'email': {
            div += '<label for="" id="lbl-' + this.elementCounter + '" >' + (labelTitle === undefined ? 'email' : labelTitle) +
                '</label>' + '<input type="email" id="fc' + this.elementCounter + '" name="email" />';


            break;
        }
        case 'number': {
            div += '<label for="" id="lbl-' + this.elementCounter + '" >' + (labelTitle === undefined ? 'number' : labelTitle) +
                '</label>' + '<input type="number" id="fc' + this.elementCounter + '" name="number" />';


            break;
        }
        case 'description': {
            div += '<label for="" id="lbl-' + this.elementCounter + '" >' + (labelTitle === undefined ? 'description' : labelTitle) +
                '</label>' +
                '<textarea id="fc' + this.elementCounter + '" name="description" cols="25" rows="5" defaultvalue=""></textarea>';


            break;
        }
        case 'decimal': {
            div += '<label for="" id="lbl-' + this.elementCounter + '" >' + (labelTitle === undefined ? 'Decimal' : labelTitle) +
                '</label>' + '<input type="text" id="fc' + this.elementCounter + '" name="decimal" />';


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
                '<textarea id="fc' + this.elementCounter + '" name="note" cols="25" rows="5" defaultvalue=""></textarea>';


            break;
        }
        case 'percent': {
            div += '<label for="" id="lbl-' + this.elementCounter + '" >' + (labelTitle === undefined ? 'Percent' : labelTitle) +
                '</label>' +
                '<input type="text" id="fc' + this.elementCounter + '" name="percent" />';


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
                + '<input type="'+(element.inputType != undefined ? element.inputType : 'text')+'" id="" name="text" />';
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
    }
}

formInputValueChanged(index, type, conditions) {
    console.log('form input value changed ' + index + ' ' + type);
    console.log(conditions);
    for (let i = 0; i < conditions.length; i++) {
        console.log('index ' + this.page.formComposition[index].id + ' condition compare to ' + conditions[i].compareTo);
        if(conditions[i] !== undefined){
            if(conditions[i].compareTo !== undefined){
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
                this.page.formComposition[i].labelTitle, i, options , this.page.formComposition[i]);   
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
                response.value = '';
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
                let v= " ";
                if(component.options !== undefined){
                    let options = JSON.parse(component.options); 
                    for(let j = 0 ; j < options.length ; j++){
                        let r = this.elementRef.nativeElement.querySelector('#fc'+i+'-'+j); 
                        if(r !== null && r!== undefined){
                            if(r.checked){
                                v= options[j]; 
                            }
                        }
                    }
                }
                response.value = v ; 

                break;
            }
            case 'image': {

                break;
            }
            case 'checkbox': {
                let v = [] ; 
                if(component.options !== undefined){
                    let options = JSON.parse(component.options); 
                    for(let j = 0 ; j < options.length ; j++){
                        let r = this.elementRef.nativeElement.querySelector('#fc'+i+'-'+j); 
                        if(r !== null && r!== undefined){
                            if(r.checked){
                                v.push(options[j]); 
                            }
                        }
                    }
                }
                response.value = JSON.stringify(v);

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
                //elt.value = value;
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

                if(component.options !== undefined){
                    let options = JSON.parse(component.options); 
                    for(let j = 0 ; j < options.length ; j++){
                        let r = this.elementRef.nativeElement.querySelector('#fc'+i+'-'+j); 
                        if(r !== null && r!== undefined){
                            if(options[j] === value){
                                r.checked = true;
                            }
                        }
                    }
                }

                break;
            }
            case 'image': {
                elt.value = value;
                break;
            }
            case 'checkbox': {

                let v = value ; 
                let vs = JSON.parse(v);
                if(vs != undefined){
                    for(let k = 0 ; k< vs.length ; k++){
                        if(component.options !== undefined){
                            let options = JSON.parse(component.options); 
                            for(let j = 0 ; j < options.length ; j++){
                                let r = this.elementRef.nativeElement.querySelector('#fc'+i+'-'+j); 
                                if(r !== null && r!== undefined){
                                    if(options[j] === vs[k]){
                                        r.checked = true;
                                    }
                                }
                            }
                        }
                    }
                }

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

    let canLoadNextPage = true ; 
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
        if(component.isRequired && (response.value === '' || response.value === undefined)){
            //console.log('field required but value missing') ; 
            //console.log(component);
            //console.log(response);
            canLoadNextPage = false;
        }
    }
    /*
    console.log('response ');
    console.log(this.candidateResponse.response);
    console.log('candidate');
    console.log(this.candidate);
    */

    return canLoadNextPage;



}

setResponse(){
    for(let i = 0 ; i < this.candidateResponse.response.length ; i++){
        this.setFieldResponse(i , this.candidateResponse.response[i].value);
    }
}

next() {
    console.log('page index' + this.pageIndex) ; 
    console.log('page count '+this.form.pages.length) ; 
    if (this.pageIndex < this.form.pages.length - 1) {

        console.log('form response');
        const canMoveNext = this.getPageResponse();
        if(canMoveNext || true){
            this.pageIndex++;
            this.loadPage(this.pageIndex);
            //this.setResponse();
            window.scrollTo(0,0);
        }
    } else {
        if(this.pageIndex === this.form.pages.length - 1){
            console.log('validate response');
            this.getPageResponse();
            //console.log(this.candidateResponse);
            this.pageIndex ++ ; 
        }
        
    }
}

previous() {
    if (this.pageIndex > 0) {
        console.log('page index '+this.pageIndex); 
        this.pageIndex--;
        console.log('condition');
        console.log("is single line "+this.isSingleColumnForm) ; 
    
        this.loadPage(this.pageIndex);
        this.setResponse();
        window.scrollTo(0,0);
    }

}


 formateDate(date: Date) : Date{
    return new Date(date.getFullYear() , date.getMonth() , date.getDate());
}



}

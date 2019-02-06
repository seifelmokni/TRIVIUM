import { Component, OnInit, ViewChild, ElementRef, Renderer2 } from '@angular/core';
import { FormsService } from '../../shared/forms/forms.service';
import { Element } from '../../models/element/element.model';
import { Form } from '../../models/form/form.model';
import { Page } from '../../models/page/page.model';
import { Model } from '../../models/model/model.model';
import { ModelsService } from '../../shared/models/models.service';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../shared/auth/auth.service';
import { DragulaService } from 'ng2-dragula';
import { Collection } from '../../models/collection/collection.model';
import { ConfigurationService } from '../../shared/configuration/configuration.service';
import { MatDialog } from '@angular/material';
import { DiscardChangesPopupComponent } from '../popup/discard-changes-popup/discard-changes-popup.component';
import { Upload } from 'src/app/models/upload/upload.model';
import { UploadService } from 'src/app/shared/upload/upload.service';
import * as firebase from 'firebase/app';
import 'firebase/storage';

@Component({
    selector: 'app-developer-edit-form',
    templateUrl: './developer-edit-form.component.html',
    styleUrls: ['./developer-edit-form.component.css']
})
export class DeveloperEditFormComponent implements OnInit {
    @ViewChild('left_container') left_container: ElementRef;
    @ViewChild('right_container') right_container: ElementRef;
    @ViewChild('formTitleContainer') formTitleContainer: ElementRef;
    @ViewChild('formNameInput') formNameInput: ElementRef;
    @ViewChild('labelTitleInput') labelTitleInput: ElementRef;

    @ViewChild('equalDropField11') equalDropField11: ElementRef;
    @ViewChild('equalDropField12') equalDropField12: ElementRef;
    @ViewChild('equalDropField21') equalDropField21: ElementRef;
    @ViewChild('equalDropField22') equalDropField22: ElementRef;
    @ViewChild('equalDropField31') equalDropField31: ElementRef;

    @ViewChild('notEqualDropField11') notEqualDropField11: ElementRef;
    @ViewChild('notEqualDropField12') notEqualDropField12: ElementRef;
    @ViewChild('notEqualDropField21') notEqualDropField21: ElementRef;
    @ViewChild('notEqualDropField22') notEqualDropField22: ElementRef;
    @ViewChild('notEqualDropField31') notEqualDropField31: ElementRef;

    @ViewChild('actionCopyTextToSelector') actionCopyTextToSelector: ElementRef;
    @ViewChild('actionCopyTextInput') actionCopyTextInput: ElementRef;
    @ViewChild('actionCopyValueToSelector') actionCopyValueToSelector: ElementRef;
    @ViewChild('actionCopyValueFromSelector') actionCopyValueFromSelector: ElementRef;
    @ViewChild('actionNotRequiredSelector') actionNotRequiredSelector: ElementRef;
    @ViewChild('actionRequiredSelector') actionRequiredSelector: ElementRef;
    @ViewChild('actionMaskSelector') actionMaskSelector: ElementRef;
    @ViewChild('roleSelector') roleSelector: ElementRef;
    @ViewChild('valuesOptions') valuesOptions: ElementRef;

    @ViewChild('modelSelector') modelSelector: ElementRef;
    @ViewChild('isRegisterform') isRegisterform: ElementRef;
    @ViewChild('isFieldRequired') isFieldRequired: ElementRef;
    @ViewChild('isFieldConditioned') isFieldConditioned: ElementRef;
    @ViewChild('jumpToPageSelector') jumpToPageSelector: ElementRef;
    @ViewChild('collectionSelector') collectionSelector: ElementRef;
    @ViewChild('lineTextTypeSelector') lineTextTypeSelector:ElementRef;
    formName = 'Entervista';
    elementLabelTitle= '';
    smallLabelTitle= '';
    youtubeSource = '' ; 
    optionsContent;
    shoudlShowValueOptions = false;
    conditionCheckedBoxIsChecked: Boolean = false;
    requiredCheckedBoxIsChecked: Boolean = false;
    fieldConditionChanged = false ; 
    discardChangePopUpShowed = false;
    isDeleteProcessRunning = false ; 
    isSingleColumnForm:Boolean = false ;
    isThisRegisterForm;
    pageSaved = true ; 
    sibling;


    conditionRAdioGroup;
    actionRadioGroup;
    elementCounter = 0;
    pageCounter = 0;
    propertyTabShown: Boolean = false;
    editFormTitleEnabled: Boolean = false;
    elementSelected: Boolean = false;
    deleteCallNumber= 0 ; 


    showActionSection: Boolean = false;
    shouldShowButtonActionSection: Boolean = false;
    buttonSelected: string;
    selectedElementIndex: number;
    componentSelected: Element;
    formComposition: Array<Element>;
    conditionedFormCompotion: Array<Element>;
    selectTypeElements: Array<Element>;
    selectTypeValues: Array<string>;
    selectTypeValuesNotEqual: Array<string>;
    textTypeElements: Array<Element>;
    oneOptionTypeElemnts: Array<Element>;
    pages: Array<Page>;
    pagesIndex: Array<number>;

    form: Form;
    pageIndex = 0;
    pageTitleTemp:string = undefined;

    collections: Collection[];
    selectedCollection: Collection;

    conditions: Array<{
        conditionType: string,
        compareTo: string,
        compareType: string,
        compareValue: string,
        actionOn: string,
        actionType: string,
        actionFrom: string
    }>;
    models: Model[];
    cond;

    constructor(private elementRef: ElementRef,
        private renderer: Renderer2,
        private formService: FormsService,
        private authService: AuthService,
        private modelService: ModelsService,
        private configService: ConfigurationService,
        private dragulaService: DragulaService,
        private uploadService: UploadService,
        private router: Router,
        private route: ActivatedRoute,
        public dialog: MatDialog) { }
        ngOnInit() {
            this.formComposition = [];
            this.pages = [];
            this.conditions = [];
            this.conditionedFormCompotion = [];
            this.selectTypeElements = [];
            this.textTypeElements = [];
            this.oneOptionTypeElemnts = [];
            this.selectedElementIndex = -1;
            this.selectTypeValues = [];
            this.selectTypeValuesNotEqual = [];
            this.pagesIndex = [1];
            
    
            this.configService.listCollection().subscribe(
                (collections: Collection[]) => {
                    this.collections = collections;
                }
            );

            this.route.params.subscribe(
                params => {
                    if(params['id'] == undefined){
                        this.buildForm(this.formService.getSelectedForm());
                    }else{
                        const id = params['id'] ;
                        this.formService.getForm(id).subscribe(
                            (f:Form[]) => {
                                if(f.length != 0){
                                    const form = f[0];
                                    this.buildForm(form); 
                                }
                            }
                        ) 
                    }
                }
            )


    
    
        }

    buildForm(f:Form){

        this.form = f;
        this.formName = this.form.title;
        //this.isThisRegisterForm = this.form.isRegisterFormPriority !== '';
        this.isSingleColumnForm = this.form.isSingleColumnForm ; 
        this.pages = this.form.pages;
        this.pageIndex = 0 ; 
        for (let i = 0; i < this.pages.length; i++) {
            this.pages[i].pageSaved = true ; 
            this.pagesIndex.push(i + 1);
        }

        this.modelService.listModels().subscribe(
            (mods: Model[]) => {
                this.models = mods;
                if (this.form.modelToSendId !== undefined) {
                    let index = 0;
                    for (let i = 0; i < this.models.length; i++) {
                        if (this.models[i].modelId === this.form.modelToSendId) {
                            index = i;
                        }
                    }
                }
            }
        );
        let maxId = 0 ;
        for (let i = 0; i < this.form.pages[0].formComposition.length; i++) {
            console.log('element');
            console.log(this.form.pages[0].formComposition[i].container);
            let options = [];
            if (this.form.pages[0].formComposition[i].options !== undefined) {
                options = JSON.parse(this.form.pages[0].formComposition[i].options);
            }
            console.log('options  ' + this.form.pages[0].formComposition[i].options);
            console.log(options);
            this.formComposition = this.form.pages[0].formComposition;
            if (this.form.pages[0].formComposition[i].isConditioned) {
                this.conditionedFormCompotion.push(this.form.pages[0].formComposition[i]);

            }
            console.log('container ') ; 
            console.log(this.form.pages[0].formComposition[i].container);
            this.createElement(
                this.form.pages[0].formComposition[i].type,
                (this.form.pages[0].formComposition[i].container === 'LEFT' ? 1 : 2),
                this.form.pages[0].formComposition[i].labelTitle,
                i,
                options ,
                this.form.pages[0].formComposition[i]
            );
            if(maxId < this.formComposition[i].id){
                maxId = this.formComposition[i].id ; 
            }
        }

        this.pageCounter = this.form.pages.length ; 
        this.pageIndex = 0 ; 

        this.dragulaService.find('elemnts').drake.on('drop', (dropElm: any, target: any, source: any, sibling: any) => {
            //do stuff here.
            this.orderChanged(dropElm,
                dropElm.parentElement.className === 'left-col col' ? 'LEFT' : 'RIGHT',
                sibling);
            });
        console.log('------------- Max ID --------------');
        console.log(maxId);
        this.elementCounter = maxId + 1 ; 
        this.isSingleColumnForm = this.form.isSingleColumnForm ; 

        for(let i = 0 ; i < this.form.pages.length ; i++){
            for(let j = 0 ; j < this.form.pages[i].formComposition.length ; j++){
                this.componentSelected = this.form.pages[i].formComposition[j] ; 
                console.log('element conditions '+this.componentSelected.type);
                console.log(this.componentSelected.isConditioned) ; 
            if(this.componentSelected.isConditioned == true){
                if (this.componentSelected.type === 'radio'
                || this.componentSelected.type === 'dropdown') {
                console.log('field radio or dropdown');
                this.selectTypeElements.push(this.componentSelected);
                } else if (this.componentSelected.type === 'checkbox') {
                const options = JSON.parse(this.componentSelected.options);
                if (options !== undefined) {
                    if (options.length === 1) {
                        console.log('field checkbox');
                        this.oneOptionTypeElemnts.push(this.componentSelected);
                    }
                }

                } else {
                if (this.componentSelected.type !== 'password'
                    && this.componentSelected.type !== 'multi_select'
                ) {
                    console.log('field text');
                    this.textTypeElements.push(this.componentSelected);
                }
                }
            }
            }
        }
    }

    drag(event, type, id?) {
        console.log('type ' + type);
        event.dataTransfer.setData('elementType', type);
        console.log('id');
        console.log(id);
        if (id !== undefined) {
            event.dataTransfer.setData('id', id);
        }
        console.log('drag event');
        console.log(event);
        console.log('class name');
        console.log(event.target.className);
    }

    drop(event, container) {
        event.preventDefault();
        this.pageSaved = false ; 

        console.log('drop action ');
        console.log(event);
        console.log('drag class name');
        console.log(event.target.tagName);
        const type = event.dataTransfer.getData('elementType');
        const id = event.dataTransfer.getData('id');
        if (id !== '') {
            console.log('drop from inter');
            console.log(event);
            console.log(container);
            console.log('id');
            console.log(event.dataTransfer.getData('id'));
        } else {
            const el = new Element(this.elementCounter, type, type, (container === 1 ? 'LEFT' : 'RIGHT'));
            this.formComposition.push(el);
            this.createElement(type, container , undefined , this.elementCounter , [] ,el );
            this.elementCounter++;
        }
    }

    orderChanged(elementId, targetContainer, sibling) {
        this.pageSaved = false ; 
        const droppedId = parseInt(elementId.id.replace(/el-/g, ''), 10);
        let nextElementId;
        if (sibling !== null) {
            nextElementId = parseInt(sibling.id.replace(/el-/g, ''), 10);
        } else {
            nextElementId = (this.elementCounter - 1);
        }
        const aux = this.formComposition[droppedId];
        const dropIndex = this.getComponentIndexSelected(droppedId); 
        const nextElementIndex = this.getComponentIndexSelected(nextElementId);
        
        console.log('index dropIndex '+dropIndex+' next element index '+nextElementIndex) ; 
        if(dropIndex != undefined && nextElementIndex != undefined){
            //this.formComposition.splice(dropIndex , 1) ; 
            const component = this.formComposition[dropIndex]; 
            component.container = targetContainer;
            console.log('the droped component');
            console.log(component);
            this.formComposition.splice(dropIndex , 1);
            let composition = []  ; 
            for(let i = 0 ; i < this.formComposition.length ; i++){
                console.log('i : '+i+' nextelementIndex'+nextElementIndex);
                if(i == nextElementIndex ){
                    console.log('adding the droped element');
                    composition.push(component);
                    composition.push(this.formComposition[i]);
                    
                }else{
                    composition.push(this.formComposition[i]);
                }
            }
          //composition.splice(dropIndex , 1);  
          console.log('new form composition') ; 
          console.log(composition);  
          this.formComposition = composition ; 
        }
        
    }

    allowDrag(event) {
        event.preventDefault();
    }



    createElement(type: string, container, labelTitle: string, index: number, values: Array<string> , element: Element) {
        this.elementCounter = index;
        console.log('type is ' + type);
        let div = '';
        
        switch (type) {
            case 'title': {
                div = '<div class="two-col dynamic" tabindex="0" style="opacity: 1; background: none;display: block !important" draggable="true"' +
                ' id="el-' + element.id + '"  >';
                break ; 
            }
            case 'section': {
                div = '<div class="two-col dynamic" tabindex="0" style="opacity: 1; background: rgb(105, 21, 27);display: block !important" draggable="true"' +
                ' id="el-' + element.id + '"  >';
                break ; 
            }
            case '2_line_text' :{
                div = '<div class="two-col dynamic" tabindex="0" style="opacity: 1; background: none; display:grid;" draggable="true"' +
                ' id="el-' + element.id + '" >';
                break ; 
            } 
            case 'paragraph': {
                div = '<div class="two-col dynamic" tabindex="0" style="opacity: 1; background: none;display: block !important" draggable="true"' +
                ' id="el-' + element.id + '"  >';
                break ; 
            }
            default : {
                div = '<div class="two-col dynamic" tabindex="0" style="opacity: 1; background: none;" draggable="true"' +
                ' id="el-' + element.id + '" >';
                break ; 
            }
        }
        switch (type) {
            case 'single_line': {
                div += '<label id="lbl-' + element.id + '" style="height:37px" >' + (labelTitle === undefined ? 'Single Line' : labelTitle) +
                    '</label>' +
                    '<input type="text" id="fc' + element.id + '"  name="singleLine" style="display:none" />';

                break;
            }
            case 'phone': {
                div += '<label id="lbl-' + element.id + '" >' + (labelTitle === undefined ? 'phone' : labelTitle) + '</label>' +
                    '<input type="tel" id="fc' + element.id + '" name="phone" />';


                break;
            }
            case 'multi_line': {
                div += '<label for="" id="lbl-' + element.id + '" >' + (labelTitle === undefined ? 'Multi line' : labelTitle) +
                    '</label>' +
                    '<textarea id="fc' + element.id + '" name="multiLine" cols="25" rows="5" defaultvalue=""></textarea>';


                break;
            }
            case 'url': {
                div += '<label for="" id="lbl-' + element.id + '" >' + (labelTitle === undefined ? 'url' : labelTitle) +
                    '</label>' + '<input type="url" id="fc' + element.id + '" name="url" />';


                break;
            }
            case 'date': {
                div += '<label for="" id="lbl-' + element.id + '" >' + (labelTitle === undefined ? 'date' : labelTitle) +
                    '</label>' + '<input type="date" id="fc' + element.id + '" name="date" />';


                break;
            }
            case 'file_upload': {
                div += '<label for="" id="lbl-' + element.id + '" >' + (labelTitle === undefined ? 'File' : labelTitle) +
                    '</label>' + '<input type="file" id="fc' + element.id + '" name="fileUpload" />';


                break;
            }
            case 'radio': {
                div += '<label for="" id="lbl-' + element.id + '" >' + (labelTitle === undefined ? 'Radio' : labelTitle) +
                    '</label>' +
                    '<div id="rd-' + element.id + '">';
                for (let i = 0; i < values.length; i++) {
                    if(values[i] !== ''){
                        div += '<p>' +
                        '<input type="radio" name="checkbox" id="fc' + element.id + '-1" ' +
                        ' value="checkbox 1"><label for="radio1">' + values[i] + '</label>' +
                        '</p>';
                    }
                }

                div += '</div>';


                break;
            }
            case 'image': {
                div += '<label for="" id="lbl-' + element.id + '" >' + (labelTitle === undefined ? 'image' : labelTitle) +
                    '</label>' + '<input type="file" id="fc' + element.id + '" name="image" />';


                break;
            }
            case 'checkbox': {
                div += '<label for="" id="lbl-' + element.id + '" >' + (labelTitle === undefined ? 'Radio' : labelTitle) +
                    '</label>' +
                    '<div id="cb-' + element.id + '">';
                for (let i = 0; i < values.length; i++) {
                    if(values[i] !== ''){
                        div += '<p>' +
                        '<input type="checkbox" name="checkbox" id="fc' + element.id + '-1" ' +
                        ' value="checkbox 1"><label for="radio1">' + values[i] + '</label>' +
                        '</p>';
                    }
                }

                div += '</div>';


                break;
            }
            case 'text': {
                div += '<label for="" id="lbl-' + element.id + '" >' + (labelTitle === undefined ? 'text' : labelTitle) +
                    '</label>' + '<input type="text" id="fc' + element.id + '" name="text" />';


                break;
            }
            case 'email': {
                div += '<label for="" id="lbl-' + element.id + '" >' + (labelTitle === undefined ? 'email' : labelTitle) +
                    '</label>' + '<input type="email" id="fc' + element.id + '" name="email" />';


                break;
            }
            case 'number': {
                div += '<label for="" id="lbl-' + element.id + '" >' + (labelTitle === undefined ? 'number' : labelTitle) +
                    '</label>' + '<input type="number" id="fc' + element.id + '" name="number" />';


                break;
            }
            case 'description': {
                div += '<label for="" id="lbl-' + element.id + '" >' + (labelTitle === undefined ? 'description' : labelTitle) +
                    '</label>' +
                    '<textarea id="fc' + element.id + '" name="description" cols="25" rows="5" defaultvalue=""></textarea>';


                break;
            }
            case 'decimal': {
                div += '<label for="" id="lbl-' + element.id + '" >' + (labelTitle === undefined ? 'Decimal' : labelTitle) +
                    '</label>' + '<input type="text" id="fc' + element.id + '" name="decimal" />';


                break;
            }
            case 'multi_select': {
                div += '<label for="" id="lbl-' + element.id + '" >' + (labelTitle === undefined ? 'Multi select' : labelTitle) +
                    '</label>' +
                    '<select multiple="" id="fc' + element.id + '" name="multiSelect">' +
                    '<option value="">--por favor, elija--</option></select>';


                break;
            }
            case 'dropdown': {
                div += '<label for="" id="lbl-' + element.id + '" >' + (labelTitle === undefined ? 'Dropdown' : labelTitle) +
                    '</label>' +
                    '<select id="sel-' + element.id + '" name="dropdown"><option value="">--por favor, elija--</option></select>';

                break;
            }
            case 'note': {
                div += '<label for="" id="lbl-' + element.id + '" >' + (labelTitle === undefined ? 'Note' : labelTitle) +
                    '</label>' +
                    '<textarea id="fc' + element.id + '" name="note" cols="25" rows="5" defaultvalue=""></textarea>';


                break;
            }
            case 'percent': {
                div += '<label for="" id="lbl-' + element.id + '" >' + (labelTitle === undefined ? 'Percent' : labelTitle) +
                    '</label>' +
                    '<input type="text" id="fc' + element.id + '" name="percent" />';


                break;
            }
            case 'password': {
                div += '<label for="" id="lbl-' + element.id + '" >' + (labelTitle === undefined ? 'Password' : labelTitle) +
                    '</label>' +
                    '<input type="password" id="" name="percent" />';
                break;
            }
            case 'white_space': {
                div += '<label class="whitespace" id="lbl-' + element.id + '" style="height: 20px;">  </label>';
                div += '<span > </span>';
                break;
            }case 'photo' : {
                div +='<label id="lbl-' + element.id + '" style="display:none"></label>';
                div += '<img class="image-container-1" id="src-' + element.id + '" src="'+(element.value !== '' ? element.value : 'https://vignette.wikia.nocookie.net/the-darkest-minds/images/4/47/Placeholder.png/revision/latest?cb=20160927044640')+'"   style="background: #d6d6d6;" /> ' ;
                break;
            }
            case 'video' : {
                div +='<label id="lbl-' + element.id + '" style="display:none"></label>';
                div += '<video id="src-' + element.id + '" src="'+element.value+'" width="100%"  style="background: #d6d6d6;"> </video> ' ;
                break;
            }
            case 'title' : {
                div +='<label id="lbl-' + element.id + '" style="font-size: 25px; font-weight: bold;">' + (labelTitle === undefined ? 'Title' : labelTitle) +
                '</label>';
                div += '<input type="text" style="display: none"> </video> ' ;
                break;
            }
            case 'section' : {
                div +='<label id="lbl-' + element.id + '" style="font-size: 20px; font-weight: bold; color: #FFF">' + (labelTitle === undefined ? 'Title' : labelTitle) +
                '</label>';
                div += '<input type="text" style="display: none"> </video> ' ;
                break;
            }
            case 'paragraph' : {
                div +='<p id="lbl-' + element.id + '" >' + (labelTitle === undefined ? 'Paragraph' : labelTitle) +
                '</p>';
                div += '<input type="text" style="display: none"> </video> ' ;
                break;
            }
            case 'youtube' : {
                div +='<label id="lbl-' + element.id + '" style="display:none"></label>';
                div += '<iframe id="src-' + element.id +'" width="420" height="315" src="'+element.value+'"></iframe>' ;
                break;
                
            }
            case '2_line_text' : {
                div += '<label for="" id="lbl-' + element.id + '" >' + (labelTitle === undefined ? 'text' : labelTitle) +
                    '</label><br><small id="sm-'+element.id+'">'+(element.value != undefined ? element.value : 'description value')+'</small><br>' 
                    + '<input type="text" id="" name="text" />';
                break;

            }

        }
        let path = '';
        if (container === 1) {
            path = '<i class="fa fa-pencil"></i>';
        } else {
            path = '<i class="fa fa-pencil"></i>';
        }

        div += '<span style="display: '+(type !== 'youtube' ? 'none' : 'block')+';">' +
            '<a title="Mover a la derecha" id="move-' + element.id + '" style="display: '+(type !== 'youtube' ? 'none' : 'block')+';">' +
            '<i class="fas fa-pencil-alt"></i>' +
            '</a>' +
            '<a title="Borrar" id="delete-' + element.id + '">' +
            '<i class="fa fa-trash-alt"></i></a>'+
            '</span>';
        div += '</div>';
        if (container === 1) {
            this.left_container.nativeElement.insertAdjacentHTML('beforeEnd', div);
        } else {
            this.right_container.nativeElement.insertAdjacentHTML('beforeEnd', div);

        }
        //for (let i = 0; i < this.elementCounter + 1; i++) {
            /*if (this.elementRef.nativeElement.querySelector('#el-' + element.id) !== undefined
                && this.elementRef.nativeElement.querySelector('#el-' + element.id) !== null) {
                this.elementRef.nativeElement.querySelector('#el-' + element.id).addEventListener('click', (event) => this.selectElement(event));
                if(this.elementRef.nativeElement.querySelector('#desc-' +element.id) !== null){
                    this.elementRef.nativeElement.querySelector('#desc-'+element.id).addEventListener('focus' , (event) => this.selectElement(event));
                }
                this.elementRef.nativeElement.querySelector('#el-' + element.id).addEventListener('dragstart',
                    (event) => this.drag(event, type, element.id));
                this.elementRef.nativeElement.querySelector('#delete-' + element.id).addEventListener('click',
                    (event) => this.removeElement(event, container, element.id));
                this.elementRef.nativeElement.querySelector('#move-' + element.id).addEventListener('click',
                    (event) => this.moveElement(event, (container === 1 ? 2 : 1), type, element.id));
                }*/
                const i  = element.id ; 
                if (this.elementRef.nativeElement.querySelector('#el-' + i) !== undefined
                    && this.elementRef.nativeElement.querySelector('#el-' + i) !== null) {
                    this.elementRef.nativeElement.querySelector('#el-' + i).addEventListener('click', (event) => this.selectElement(event));
                    if(this.elementRef.nativeElement.querySelector('#desc-' +i) !== null){
                        this.elementRef.nativeElement.querySelector('#desc-'+i).addEventListener('focus' , (event) => this.selectElement(event));
                    }
                    
                    this.renderer.listen(this.elementRef.nativeElement.querySelector('#el-' + i)
                     , 'dragstart' , 
                     (event) => this.drag(event, type, i));
                    this.renderer.listen(this.elementRef.nativeElement.querySelector('#delete-' + i) , 'click' ,(event) => this.removeElement(event, container, i) );    
                    this.renderer.listen(this.elementRef.nativeElement.querySelector('#move-' + i) , 'click' ,(event) => this.moveElement(event, (container === 1 ? 2 : 1), type, i) );    
                }

        //}
    }



    onFileLoad(fileLoadedEvent) {
        const img = fileLoadedEvent.target.result;

        const image = new Image() ;
        image.src = img ; 
        image.onload = (e) => {

            console.log('image is') ; 
            console.log(image.height) ;
            console.log(image.width) ; 
            const ratio = image.height/image.width ; 
            console.log(ratio) ;  
            this.elementRef.nativeElement.querySelector('#src-'+this.componentSelected.id).src = img ; 
            this.renderer.setStyle(this.elementRef.nativeElement.querySelector('#src-'+this.componentSelected.id) , 'height' , (ratio * 100)+'% !important' );
        }
    }

    sourceChanged(event){
        console.log("file changed") ; 
        console.log(event.target.files) ; 

            const fileReader = new FileReader();
            fileReader.onload = (e) => this.onFileLoad(e);
            fileReader.readAsDataURL(event.target.files[0]);

        
        const upload = new Upload(event.target.files[0]);

                const uploadTask = this.uploadService.pushUpload(upload);
                uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED, (snapshot) => {
                    console.log('upload'); 
                    console.log('upload finished') ;
                    console.log(uploadTask.snapshot.downloadURL) ; 
                },
                    (error) => {
                        // upload error
                        console.log('error ');
                        console.log(error);
                    },
                    () => {
                        upload.url = uploadTask.snapshot.downloadURL;
                        upload.name = upload.file.name;
                        console.log('upad completed '+upload.url );
                        uploadTask.snapshot.ref.getDownloadURL().then((downloadUrl) =>{
                            console.log('download url') ; 
                            console.log(downloadUrl) ; 
                            this.componentSelected.value = downloadUrl ; 
                            console.log(upload.file) ; 
                        });
                        
                    }
                ); 
    }

    inputTypeSelectChange(){
        const inputType = this.lineTextTypeSelector.nativeElement.options[this.lineTextTypeSelector.nativeElement.selectedIndex].value ; 
        this.componentSelected.inputType = inputType ; 
        console.log('input tupe select change');
        console.log(this.componentSelected) ;;
    }

    youtubeSourceChange(){
        console.log('youtubeSourceChange '+this.youtubeSource) ; 
        console.log('id '+('src-'+this.selectedElementIndex)) ; 
        this.elementRef.nativeElement.querySelector('#src-'+this.selectedElementIndex).src = this.youtubeSource;
        this.componentSelected.value = this.youtubeSource ; 
    }

    
    selectElementAction(event){
        console.log('event');
        console.log(event);
        this.shoudlShowValueOptions = false;
        if (this.labelTitleInput !== undefined) {
            this.labelTitleInput.nativeElement.value = '';
            this.roleSelector.nativeElement.selectedIndex = 0;

        }
        const target = event.target.parentNode;
        if (event.target.tagName === 'DIV' 
        || event.target.tagName === 'INPUT' 
        || event.target.tagName === 'LABEL' 
        || event.target.tagName === 'TEXTAREA'
        || event.target.tagName === 'IMG'
        || event.target.tagName === 'VIDEO'
        || event.target.tagName === 'P'
        || event.target.tagName === 'IFRAME'
        || event.target.tagName === 'A'
        || event.target.tagName === 'I'
        || event.target.tagName === 'SMALL'
        ) {
            this.elementSelected = true;

            // tslint:disable-next-line:radix
            this.selectedElementIndex = parseInt(target.id.replace(/el-/g, '')) | parseInt(target.id.replace(/move-/g, '')) | parseInt(target.id.replace(/sm-/g, ''));
            console.log('selected element ' + this.selectedElementIndex);
            this.componentSelected = this.getComponentSelected(this.selectedElementIndex);
            
            console.log('element select');
            this.disselectAllElemnt();
            console.log(target);
            console.log(target.tagName);
            console.log('target id ');
            console.log(target.id);
            console.log(target.children);
            this.renderer.setStyle(target, 'opacity', '1');
            this.renderer.setStyle(target, 'background', 'rgb(244, 245, 245)');
            
            // for (let i = 0; i < target.children.length; i++) {
            //     console.log(target.children[i].tagName) ;
            //     if (target.children[i].tagName == 'SPAN') {
            //         this.renderer.setStyle(target.children[i], 'display', 'bloc');
            //     }
            // }
            console.log('selected componenet');
            console.log(this.componentSelected);
            if(this.componentSelected != undefined){
                if(target.children[2] !== undefined){
                    this.renderer.setStyle(target.children[2], 'display', 'block');
                }
                if(this.componentSelected.type === '2_line_text'){
                    this.renderer.setStyle(target.children[5], 'display', 'block');
                }
                if(this.componentSelected.type === 'title'){
                    this.renderer.setStyle(target , 'display' , 'block'); 
                }
                if(this.componentSelected.type === 'section'){
                    this.renderer.setStyle(target , 'display' , 'block'); 
                    this.renderer.setStyle(target , 'background' , 'rgb(105, 21, 27)');
                }
                this.conditionCheckedBoxIsChecked = this.componentSelected.isConditioned;
                this.requiredCheckedBoxIsChecked = this.componentSelected.isRequired;
                this.elementLabelTitle =this.componentSelected.labelTitle;
                this.smallLabelTitle = this.componentSelected.value ; 
                this.youtubeSource = this.componentSelected.value ; 
                
                if(this.labelTitleInput !== undefined){
                    this.labelTitleInput.nativeElement.value = this.componentSelected.labelTitle;
                }
    
                if (this.componentSelected.type === 'radio'
                    || this.componentSelected.type === 'checkbox'
                    || this.componentSelected.type === 'multi_select'
                    || this.componentSelected.type === 'dropdown') {
                    this.shoudlShowValueOptions = true;
                    if (this.componentSelected.options !== ''
                        && this.componentSelected.options !== undefined) {
                        const opts = JSON.parse(this.componentSelected.options);
                        this.optionsContent = '';
                        if (opts !== undefined) {
                            for (let i = 0; i < opts.length - 1; i++) {
                                this.optionsContent += opts[i] + '\n';
                            }
                            this.optionsContent += opts[opts.length - 1] + '\n';
    
                        }
    
                    }
    
                }
            }
            
        }

    }
    getComponentIndexSelected(id){
        console.log('form composition') ; 
        console.log(this.formComposition) ; 
        for(let i = 0 ; i < this.formComposition.length ; i++){
            if(this.formComposition[i].id == id){
                return i; 
            }
        }
    }
    getComponentSelected(id){
        console.log('form composition '+id) ; 
        console.log(this.formComposition) ; 
        //return this.formComposition[id];
        
        for(let i = 0 ; i < this.formComposition.length ; i++){
            if(this.formComposition[i].id == id){
                return this.formComposition[i] ; 
            }
        } 
    }

    selectElement(event) {
        console.log('fieldConditionChanged '+this.fieldConditionChanged) ; 
        if(this.fieldConditionChanged === true){
            console.log('open dialog DiscardChangesPopupComponent') ; 
            if(!this.discardChangePopUpShowed){
                this.discardChangePopUpShowed = true;
                const message = "Discard changes on field ?";
                const dialogRef = this.dialog.open(DiscardChangesPopupComponent, {
                    width: '300px',
                    height: '200px',
                    data: { message: message }
                });
        
                dialogRef.afterClosed().subscribe(result => {
                    console.log('The dialog was closed');
                    console.log(result);
                    this.discardChangePopUpShowed = false;
                    if (result === true) {
                        this.fieldConditionChanged = !result ; 
                        this.selectElementAction(event) ; 
                    }
                });
            }
           
        }else{
        this.selectElementAction(event) ; 
        }

    }


    collectionSelectorChanged() {
        const id = this.collectionSelector.nativeElement.options[this.collectionSelector.nativeElement.selectedIndex].value;
        if (id !== '-1') {
            for (let i = 0; i < this.collections.length; i++) {
                if (this.collections[i].colectionId === id) {
                    this.selectedCollection = this.collections[i];
                    break;
                }
            }
        } else {
            this.selectedCollection = null;
        }

        if (this.selectedCollection !== null) {
            this.optionsContent = '';
            for (let i = 0; i < this.selectedCollection.items.length; i++) {
                this.optionsContent += this.selectedCollection.items[i];
                this.optionsContent += '\n';
            }
            this.changeValues(13);
        }

    }

    setElementRole() {

        if (this.roleSelector.nativeElement.options[this.roleSelector.nativeElement.selectedIndex].value !== '0') {
            this.componentSelected.role =
                this.roleSelector.nativeElement.options[this.roleSelector.nativeElement.selectedIndex].value;

            this.labelTitleInput.nativeElement.value =
                this.roleSelector.nativeElement.options[this.roleSelector.nativeElement.selectedIndex].innerHTML;
            this.editLabelTitle();
        }

    }

    changeValues(code) {

        console.log('code');
        console.log(code);
        if (code === 13 || code === 8 || true) {
            const values = this.valuesOptions.nativeElement.value.split('\n');
            console.log('v');
            console.log(this.valuesOptions.nativeElement.value);
            console.log('values ' + this.selectedElementIndex);
            console.log(values);
            let div;
            let id = '';

            if (this.componentSelected.type === 'radio'
            ) {
                id = '#rd-' + this.selectedElementIndex;

            }
            if (this.componentSelected.type === 'checkbox') {
                id = '#cb-' + this.selectedElementIndex;

            }
            if (this.componentSelected.type === 'multi_select'
                || this.componentSelected.type === 'dropdown') {
                id = '#sel-' + this.selectedElementIndex;
            }
            console.log('the id ' + id);
            div = this.elementRef.nativeElement.querySelector(id);
            div.innerHTML = '';

            if (this.componentSelected.type === 'multi_select'
                || this.componentSelected.type === 'dropdown') {
                div.innerHTML = '<option value="">--por favor, elija--</option></select>';
            }
            this.componentSelected.options = JSON.stringify(values);
            for (let i = 0; i < values.length; i++) {
                if (values[i] !== '') {
                    if (this.componentSelected.type === 'radio'
                    ) {
                        const op = '<p><input type="radio" name="checkbox-' + this.selectedElementIndex + '" id="checkbox2" ' +
                            'value="checkbox 1"><label for="radio1">' + values[i] + '</label></p>';
                        div.innerHTML += op;
                    }
                    if (this.componentSelected.type === 'checkbox') {
                        const op = '<p><input type="checkbox" name="checkbox-' + this.selectedElementIndex + '" id="checkbox2" ' +
                            'value="checkbox 1"><label for="radio1">' + values[i] + '</label></p>';
                        div.innerHTML += op;
                    }
                    if (this.componentSelected.type === 'multi_select'
                        || this.componentSelected.type === 'dropdown') {
                        const op = '<option value="' + values[i] + '">' + values[i] + '</option></select>';
                        div.innerHTML += op;

                    }
                }


            }
        }
    }

    disselectAllElemnt() {
        this.shouldShowButtonActionSection = false;
        this.smallLabelTitle = '' ; 
        if (this.isFieldRequired !== undefined) {
            console.log('uncheck');
            this.requiredCheckedBoxIsChecked = false;
            this.conditionCheckedBoxIsChecked = false;
            this.actionRadioGroup = 0;
            this.conditionRAdioGroup = 0;
            this.optionsContent = '';
        }

        let children = this.left_container.nativeElement.children;
        for (let i = 0; i < children.length; i++) {
            const id = children[i].id.replace(/el-/g , '') ; 
            const c = this.getComponentSelected(id) ;
            this.renderer.setStyle(children[i], 'opacity', '1');
            this.renderer.setStyle(children[i], 'background', 'none');
            this.renderer.setStyle(children[i].children[2], 'display', 'none');

          
            console.log('disselect type '+i) ; 
            console.log(id) ; 
            if(c != undefined){
                if(c.type !='youtube'){
                    this.renderer.setStyle(children[i].children[2], 'display', 'block');

                }
                
                if(c.type == 'title'){
                    this.renderer.setStyle(children[i] , 'display' , 'block'); 
                }
                if(c.type == 'section'){
                    this.renderer.setStyle(children[i] , 'display' , 'block'); 
                    this.renderer.setStyle(children[i] , 'background' , 'rgb(105, 21, 27)');
                }
                if(c.type =='2_line_text'){
                    if(children[i].children[5] != undefined){
                        this.renderer.setStyle(children[i].children[5], 'display', 'none');
                    }
                    console.log('2 line text');
                    this.renderer.setStyle(children[i].children[2], 'display', 'block');
                }
            }

        }
        if(this.right_container !== undefined){
            children = this.right_container.nativeElement.children;
            for (let i = 0; i < children.length; i++) {
                this.renderer.setStyle(children[i], 'opacity', '1');
                this.renderer.setStyle(children[i], 'background', 'none');
                this.renderer.setStyle(children[i].children[2], 'display', 'none');
                const id = children[i].id.replace(/el-/g , '') ; 
            const c = this.getComponentSelected(id) ; 
            if(c !== undefined){
                if(c.type === 'title'){
                    this.renderer.setStyle(children[i] , 'display' , 'block'); 
                }
                if(c.type === 'section'){
                    this.renderer.setStyle(children[i] , 'display' , 'block'); 
                    this.renderer.setStyle(children[i] , 'background' , 'rgb(105, 21, 27)');
                }
            }
            }
        }
    }

    removeElement(event, fromContainer, id) {
        event.stopPropagation();
        this.pageSaved = false ; 
        this.isDeleteProcessRunning = true ;
        console.log('delete call number '+this.deleteCallNumber);
        console.log(event);
        this.deleteCallNumber ++;
        console.log('delete element');
        console.log('old form compositon') ; 
        console.log(this.formComposition);
        this.disselectAllElemnt(); 
        this.formComposition.splice(this.getComponentIndexSelected(id) , 1); 
        this.deleteElement(id, fromContainer);
        console.log('new form compositon') ; 
        console.log(this.formComposition);         
        
      
    }

    deleteElement(id, fromContainer) {
        console.log('delete element');
        const element = this.elementRef.nativeElement.querySelector('#el-' + id);
        let container: any;
        if (fromContainer === 1) {
            container = this.left_container;
        } else {
            container = this.right_container;
        }
        try{
            this.renderer.removeChild(container.nativeElement, element);
        }catch(error){

        }
    }

    moveElement(event, toContainer, type, id) {
        if(type === 'youtube'){
            this.selectElement(event);
        }
        //console.log('move element');
        //this.createElement(type, toContainer);
        //this.deleteElement(id, (toContainer === 1 ? 2 : 1));
    }
    addPage(addPageToList = false) {
        console.log('add page');
        if(!this.pageSaved){
            this.pages[this.pageIndex] = new Page(this.formComposition, 
                this.pageTitleTemp === undefined ? 'step ' + this.pageCounter : this.pageTitleTemp ,
                this.elementCounter
                );
                this.pageTitleTemp = undefined  ; 
                this.pages[this.pageIndex].conditions = this.conditions != undefined ? this.conditions : [];
        }else{
            const p = new Page([], 
                this.pageTitleTemp === undefined ? 'step ' + this.pageCounter : this.pageTitleTemp ,
                this.elementCounter
                );
                this.pageTitleTemp = undefined  ; 
                this.pages[this.pageIndex].conditions = this.conditions;
            p.conditions = [];
            this.pages.push(p) ; 
        }
        
            this.pageCounter++;

        this.elementCounter = 0;
        this.formComposition = [];
        // this.conditions = [];
        this.left_container.nativeElement.innerHTML = '';
        if(this.right_container != undefined){
            this.right_container.nativeElement.innerHTML = '';
        }
        console.log(this.pages);
        
            if(addPageToList){
                this.pagesIndex.push(this.pageIndex + 1);
                const page = new Page(this.formComposition, 
                    this.pageTitleTemp === undefined ? 'step ' + this.pageCounter : this.pageTitleTemp ,
                    this.elementCounter
                    );
                this.pages.push(page) ;
            }
            this.loadPage(this.pages[this.pages.length -1] , this.pages.length -1) ;  
            

    }
    /*
    addPage() {
        console.log('page index '+this.pageCounter);
        console.log(this.pages[this.pageCounter]);
            if(!this.pages[this.pageCounter].pageSaved || !this.pageSaved){
                this.pages[this.pageCounter].formComposition = this.formComposition ; 
                this.pages[this.pageCounter].elementCount = this.elementCounter ; 
                this.pages[this.pageCounter].pageTitle = this.pageTitleTemp == undefined ? this.pages[this.pageCounter].pageTitle : this.pageTitleTemp ;                 
                this.pages[this.pageCounter].pageSaved = true;
            }
            console.log('add page');
            console.log(this.formComposition)
            const page = new Page([], 
                this.pageTitleTemp === undefined ? 'step ' + this.pageCounter : this.pageTitleTemp ,
                0
                );
            this.pageTitleTemp = undefined  ; 
            page.pageSaved = false; 
            page.conditions = this.conditions;
            this.pages.push(page);
        this.pageCounter++;
        this.pagesIndex.push(this.pageCounter + 1);
        
        this.elementCounter = 0;
        this.formComposition = [];
        // this.conditions = [];

        this.left_container.nativeElement.innerHTML = '';
        if(this.right_container != undefined){
            this.right_container.nativeElement.innerHTML = '';
        }
        this.pageSaved = false;
        console.log(this.pages);
       
    } */

    editFormNameChanged(code){
        if(code === 13){
            this.editFormName();
        }
    }

    editFormName() {
        if (!this.editFormTitleEnabled) {
            this.editFormTitleEnabled = true;
            this.formNameInput.nativeElement.value = this.formTitleContainer.nativeElement.innerHTML;
            this.formNameInput.nativeElement.focus();
        } else {
            this.editFormTitleEnabled = false;
            this.formTitleContainer.nativeElement.innerHTML = this.formNameInput.nativeElement.value;
                console.log('page index '+this.pageIndex);
                if(this.pages[this.pageIndex] !== undefined){
                    this.pages[this.pageIndex].pageTitle = this.formNameInput.nativeElement.value;                    
                }else{
                    this.pageTitleTemp = this.formNameInput.nativeElement.value;
                }
        }
    }

    editLabelTitle() {
        const lbl = this.elementRef.nativeElement.querySelector('#lbl-' + this.selectedElementIndex);
        lbl.innerHTML = this.labelTitleInput.nativeElement.value.replace(/\n/g,'<br>');
        this.componentSelected.labelTitle = this.labelTitleInput.nativeElement.value.replace(/\n/g,'<br>');
    }

    editSmallLabelTitle() {
        const lbl = this.elementRef.nativeElement.querySelector('#sm-' + this.selectedElementIndex);
        lbl.innerHTML = this.smallLabelTitle;
        console.log('small label '+this.smallLabelTitle) ; 
        this.componentSelected.value = this.smallLabelTitle.replace(/\n/g,'<br>');
    }

    loadPage(page: Page, index: number) {
        console.log('loading form');
        console.log(page);
        this.left_container.nativeElement.innerHTML = '';
        this.right_container.nativeElement.innerHTML = '';
        this.formTitleContainer.nativeElement.innerHTML = page.pageTitle;
        this.formComposition = page.formComposition;
        this.elementSelected = false;
        this.conditions = page.conditions;
        this.pageIndex = index;
        let idMax = 0;

        for (let i = 0; i < this.formComposition.length; i++) {
            let options = [];
                if (this.formComposition[i].options !== undefined) {
                    options = JSON.parse(this.formComposition[i].options);
                }
                console.log('options  ' + this.formComposition[i].options);
                console.log(options);
                if (this.formComposition[i].isConditioned) {
                    this.conditionedFormCompotion.push(this.formComposition[i]);
    
                }
                this.createElement(
                    this.formComposition[i].type,
                    (this.formComposition[i].container === 'LEFT' ? 1 : 2),
                    this.formComposition[i].labelTitle,
                    i,
                    options,
                    this.formComposition[i]
                );
                if(this.formComposition[i].id > idMax){
                    idMax = this.formComposition[i].id ; 
                }
            //this.elementCounter = i;
        }
        this.elementCounter = idMax + 1 ; 



    }

    selectEqualField(index, shouldLoadValue?) {
        console.log('select radio condition');
        this.fieldConditionChanged = true ;

        if (index === 1) {
            const ecp1 = this.equalDropField11.nativeElement.options[this.equalDropField11.nativeElement.selectedIndex].value;
            const ecp2 = this.equalDropField12.nativeElement.options[this.equalDropField12.nativeElement.selectedIndex].value;

            console.log('ecp');
            console.log(ecp1 + '  ' + ecp2);
            this.cond = {
                conditionType: 'equal',
                compareTo: ecp1,
                compareType: 'element',
                compareValue: ecp2,
                actionOn: '',
                actionType: '',
                actionFrom: ''
            };

        }
        if (index === 2) {
            const ecp1 = this.equalDropField21.nativeElement.options[this.equalDropField21.nativeElement.selectedIndex].value;
            const ecp2 = this.equalDropField22.nativeElement.value;
            console.log('ecp');
            console.log(ecp1 + '  ' + ecp2);
            this.cond = {
                conditionType: 'equal',
                compareTo: ecp1,
                compareType: 'string',
                compareValue: ecp2,
                actionOn: '',
                actionType: '',
                actionFrom: ''
            };
        }
        if (index === 3) {
            const ecp1 = this.equalDropField31.nativeElement.options[this.equalDropField31.nativeElement.selectedIndex].value;
            console.log('ecp');
            console.log(ecp1);
            this.cond = {
                conditionType: 'equal',
                compareTo: ecp1,
                compareType: 'activate',
                compareValue: '',
                actionOn: '',
                actionType: '',
                actionFrom: ''
            };
        }

        this.showActionSection = true;


    }

    selectNotEqualField(index, shouldLoadValue?) {
        console.log('select radio condition');
        this.fieldConditionChanged = true ;


        if (index === 1) {
            const ecp1 = this.notEqualDropField11.nativeElement.options[this.notEqualDropField11.nativeElement.selectedIndex].value;
            const ecp2 = this.notEqualDropField12.nativeElement.options[this.notEqualDropField12.nativeElement.selectedIndex].value;
            console.log('ecp');
            console.log(ecp1 + '  ' + ecp2);
            this.cond = {
                conditionType: 'notequal',
                compareTo: ecp1,
                compareType: 'string',
                compareValue: ecp2,
                actionOn: '',
                actionType: '',
                actionFrom: ''
            };

        }
        if (index === 2) {
            const ecp1 = this.notEqualDropField21.nativeElement.options[this.notEqualDropField21.nativeElement.selectedIndex].value;
            const ecp2 = this.notEqualDropField22.nativeElement.value;
            console.log('ecp');
            console.log(ecp1 + '  ' + ecp2);
            this.cond = {
                conditionType: 'notequal',
                compareTo: ecp1,
                compareType: 'string',
                compareValue: ecp2,
                actionOn: '',
                actionType: '',
                actionFrom: ''
            };
        }
        if (index === 3) {
            const ecp1 = this.notEqualDropField31.nativeElement.options[this.notEqualDropField31.nativeElement.selectedIndex].value;
            console.log('ecp');
            console.log(ecp1);
            this.cond = {
                conditionType: 'notequal',
                compareTo: ecp1,
                compareType: 'activate',
                compareValue: '',
                actionOn: '',
                actionType: '',
                actionFrom: ''
            };
        }

        this.showActionSection = true;


    }

    loadDropDownValue(equal) {
        if (equal === 1) {
            const ecp1 = this.equalDropField11.nativeElement.options[this.equalDropField11.nativeElement.selectedIndex].value ;
            if (ecp1 !== -1) {
                console.log('ecp is not -1');
                console.log(ecp1);
                /*let index = -1;
                for (let i = 0; i < this.formComposition.length; i++) {
                    console.log('element id ' + this.formComposition[i].id);
                    if (this.formComposition[i].id.toString() === ecp1.toString()) {
                        index = i;
                        break;
                    }
                }*/
                //if (index !== -1) {
                    console.log(this.selectTypeElements);
                    console.log('cp is not defined');
                    const dropDownElement = this.getComponentSelected(ecp1) ; 
                    console.log('element selected ') ; 
                    console.log(dropDownElement);
                    if (dropDownElement.options !== undefined && dropDownElement.options !== '') {
                        console.log('cp option is good');
                        this.selectTypeValues = JSON.parse(dropDownElement.options);
                    }
                //} 
            } else {
                this.selectTypeValues = [];
            }
            console.log('options &&&&&&&&');
            console.log(this.selectTypeValues);

        } else {
            const ecp1 = this.notEqualDropField11.nativeElement.options[this.notEqualDropField11.nativeElement.selectedIndex].value;
            if (ecp1 !== -1) {
                let index = -1;
                /*for (let i = 0; i < this.formComposition.length; i++) {
                    console.log('element id ' + this.formComposition[i].id);
                    if (this.formComposition[i].id.toString() === ecp1.toString()) {
                        index = i;
                        break;
                    }
                }*/
                //if (index !== -1) {
                    console.log('cp is not defined');
                    const dropDownElement = this.getComponentSelected(ecp1) ; 
                    console.log('element selected ') ; 
                    console.log(dropDownElement);
                   
                    if (dropDownElement.options !== undefined && dropDownElement.options !== '') {
                        console.log('cp option is good');
                        this.selectTypeValuesNotEqual = JSON.parse(dropDownElement.options);
                    }
                //}
            } else {
                this.selectTypeValuesNotEqual = [];
            }
            console.log('options &&&&&&&');
            console.log(this.selectTypeValuesNotEqual);
        }
    }


    createCondition(index) {
        this.fieldConditionChanged = true ;

        switch (index) {
            case 1: {
                // Mask Field
                const ao = this.componentSelected.id;
                const at = 'mask';
                const af = '';
                this.cond.actionOn = ao;
                this.cond.actionType = at;
                this.cond.actionFrom = af;
                break;
            }
            case 2: {
                // field not required
                const ao = this.componentSelected.id;
                const at = 'fieldRequired';
                const af = '';
                this.cond.actionOn = ao;
                this.cond.actionType = at;
                this.cond.actionFrom = af;
                break;
            }
            case 3: {
                // field not required
                const ao = this.componentSelected.id;
                const at = 'fieldNotRequired';
                const af = '';
                this.cond.actionOn = ao;
                this.cond.actionType = at;
                this.cond.actionFrom = af;
                break;
            }
            case 4: {
                // copy value from element to element
                const ao = this.componentSelected.id;
                const at = 'copyValue';
                const af =
                    this.actionCopyValueFromSelector.nativeElement
                        .options[this.actionCopyValueFromSelector.nativeElement.selectedIndex].value;
                this.cond.actionOn = ao;
                this.cond.actionType = at;
                this.cond.actionFrom = af;
                break;
            }
            case 5: {
                // copy text to element
                console.log('copy text case');
                const ao = this.componentSelected.id;
                const at = 'copyText';
                const af = this.actionCopyTextInput.nativeElement.value;
                this.cond.actionOn = ao;
                this.cond.actionType = at;
                this.cond.actionFrom = af;
                break;
            }
            case 6: {
                // button condition
                this.cond.actionOn = this.buttonSelected;
                this.cond.actionType = 'jump_to';
                this.cond.actionFrom =
                    this.jumpToPageSelector.nativeElement.options[this.jumpToPageSelector.nativeElement.selectedIndex].value;

                break;
            }
        }

    }

    validateCondition() {
        console.log('creating condition');

        console.log(this.conditionRAdioGroup);
        console.log(this.actionRadioGroup);
        if (this.conditionRAdioGroup > 0) {
            this.selectEqualField(this.conditionRAdioGroup);
            this.createCondition(this.actionRadioGroup);
        } else {
            this.selectNotEqualField(-this.conditionRAdioGroup);
            this.createCondition(this.actionRadioGroup);
        }

        console.log('condition is ');
        if (this.cond === undefined) {
            this.cond = {};
        }
        console.log(this.cond);
        this.conditions.push(this.cond);
        if (this.pages.length !== 0) {
            this.pages[this.pageIndex].conditions = this.conditions;
        }
        this.fieldConditionChanged = false ;


    }

    makeFieldRequired() {
        if (this.isFieldRequired.nativeElement.checked) {
            this.componentSelected.isRequired = true;
        } else {
            this.componentSelected.isRequired = false;
        }
    }

    makeFieldCondition() {
        console.log('make field contioned');
        console.log(this.componentSelected.type);
        if (this.isFieldConditioned.nativeElement.checked) {
            this.componentSelected.isConditioned = true;
            if (this.componentSelected.type === 'radio'
                || this.componentSelected.type === 'dropdown') {
                console.log('field radio or dropdown');
                this.selectTypeElements.push(this.componentSelected);
            } else if (this.componentSelected.type === 'checkbox') {
                const options = JSON.parse(this.componentSelected.options);
                if (options !== undefined) {
                    if (options.length === 1) {
                        console.log('field checkbox');
                        this.oneOptionTypeElemnts.push(this.componentSelected);
                    }
                }

            } else {
                if (this.componentSelected.type !== 'password'
                    && this.componentSelected.type !== 'multi_select'
                ) {
                    console.log('field text');
                    this.textTypeElements.push(this.componentSelected);
                }
            }


            this.conditionedFormCompotion.push(this.componentSelected);
        } else {
            this.componentSelected.isConditioned = false;


            if (this.componentSelected.type === 'radio'
                || this.componentSelected.type === 'dropdown') {
                let popIndex = -1;
                for (let i = 0; i < this.selectTypeElements.length; i++) {
                    if (this.selectTypeElements[i].id === this.componentSelected.id) {
                        popIndex = i;
                    }
                }
                if (popIndex !== -1) {
                    this.selectTypeElements.splice(popIndex, 1);
                }
            } else if (this.componentSelected.type === 'checkbox') {
                const options = JSON.parse(this.componentSelected.options);
                if (options !== undefined) {
                    if (options.length === 1) {
                        let popIndex = -1;
                        for (let i = 0; i < this.oneOptionTypeElemnts.length; i++) {
                            if (this.oneOptionTypeElemnts[i].id === this.componentSelected.id) {
                                popIndex = i;
                            }
                        }
                        if (popIndex !== -1) {
                            this.oneOptionTypeElemnts.splice(popIndex, 1);
                        }
                    }
                }

            } else {
                if (this.componentSelected.type !== 'password'
                    && this.componentSelected.type === 'multi_select'
                ) {
                    let popIndex = -1;
                    for (let i = 0; i < this.textTypeElements.length; i++) {
                        if (this.textTypeElements[i].id === this.componentSelected.id) {
                            popIndex = i;
                        }
                    }
                    if (popIndex !== -1) {
                        this.textTypeElements.splice(popIndex, 1);
                    }
                }
            }


        }
        console.log('select type elements');
        console.log(this.selectTypeElements);
        console.log('text type element');
        console.log(this.textTypeElements);
        console.log('one option type element');
        console.log(this.oneOptionTypeElemnts);
    }

    selectButton(buttonIndex) {
        this.disselectAllElemnt();
        this.buttonSelected = buttonIndex;
        this.shouldShowButtonActionSection = true;
        this.showActionSection = true;
        this.selectedElementIndex = -1;
    }

    previewForm(){
        
        this.addPage(false);

        const form = new Form(this.authService.getUserSession().userID,
            this.pages,
            (new Date()).toString(),
            this.formName);
            form.isSingleColumnForm = this.form.isSingleColumnForm;
            this.formService.setSelectedForm(form);
            this.router.navigate(['preview']);
    }
    deletePage(){
        
        if(this.pageIndex < this.pages.length){
            this.pages.splice(this.pageIndex , 1) ; 
            if(this.pageIndex < this.pages.length){
                this.loadPage(this.pages[this.pageIndex] , this.pageIndex) ; 
            }else{
                this.loadPage(this.pages[this.pageIndex - 1] , this.pageIndex - 1) ; 
            }
        }

    }



    saveForm() {
        console.log('form composition ' + this.pageIndex);
        console.log('pages') ; 
        console.log(this.pages)
        if (this.pages.length === 0) {
            this.addPage(false);
        } else{
            console.log('saving last page');
            const lastPage = this.pages[this.pageIndex] ; 
            if(lastPage.pageSaved == false){
                this.pages[this.pageIndex].formComposition = this.formComposition;
                this.pages[this.pageIndex].elementCount = this.elementCounter;
                this.pages[this.pageIndex].pageTitle = this.pageTitleTemp ; 
                this.pages[this.pageIndex].pageSaved = true ; 
                
            }
        }

        const form = new Form(this.form.creatorId,
            this.pages,
            this.form.creationTimestamp,
            this.formName);
            form.formId = this.form.formId;

        if (this.modelSelector !== undefined) {
            if (this.modelSelector.nativeElement.selectedIndex !== 0) {
                form.modelToSendId =
                    this.modelSelector.nativeElement.options[this.modelSelector.nativeElement.selectedIndex].value;
            }
            if (this.isRegisterform.nativeElement.checked) {
                //form.isRegisterFormPriority = (new Date()).toString();
            }
        }
        console.log('old form');
        console.log(this.form);
        console.log('new form');
        console.log(form);
        
        this.formService.update(form).then(
            () => {
                this.router.navigate(['developper']);
            }
        ); 
    }

}

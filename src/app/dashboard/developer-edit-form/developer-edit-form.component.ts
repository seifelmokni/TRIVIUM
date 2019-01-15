import { Component, OnInit, ViewChild, ElementRef, Renderer2 } from '@angular/core';
import { FormsService } from '../../shared/forms/forms.service';
import { Element } from '../../models/element/element.model';
import { Form } from '../../models/form/form.model';
import { Page } from '../../models/page/page.model';
import { Model } from '../../models/model/model.model';
import { ModelsService } from '../../shared/models/models.service';
import { Router } from '@angular/router';
import { AuthService } from '../../shared/auth/auth.service';
import { DragulaService } from 'ng2-dragula';
import { Collection } from '../../models/collection/collection.model';
import { ConfigurationService } from '../../shared/configuration/configuration.service';
import { MatDialog } from '@angular/material';
import { PreviewformComponent } from '../popup/previewform/previewform.component';
import { DiscardChangesPopupComponent } from '../popup/discard-changes-popup/discard-changes-popup.component';

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
    optionsContent;
    shoudlShowValueOptions = false;
    conditionCheckedBoxIsChecked: Boolean = false;
    requiredCheckedBoxIsChecked: Boolean = false;
    isThisRegisterForm: Boolean = false;
    fieldConditionChanged = false ; 
    discardChangePopUpShowed = false;

    conditionRAdioGroup;
    actionRadioGroup;
    elementCounter = 0;
    pageCounter = 0;
    pageTitleTemp:string = undefined;
    propertyTabShown: Boolean = false;
    editFormTitleEnabled: Boolean = false;
    elementSelected: Boolean = false;

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
    pageSaved = false;
    formName;
    elementLabelTitle='';

    form: Form;
    pageIndex = 0;

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
        private router: Router,
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
        this.dragulaService.drop('elemnts').subscribe(({ name, el, target, source, sibling }) => {
            // ...
            console.log('dragula drop event');
            console.log(el.id);
            console.log(el.parentElement.className);
            console.log('siblings');
            console.log(sibling);
            this.orderChanged(el,
                el.parentElement.className === 'left-col col' ? 'LEFT' : 'RIGHT',
                sibling);
        });

        this.configService.listCollection().subscribe(
            (collections: Collection[]) => {
                this.collections = collections;
            }
        );
        this.form = this.formService.getSelectedForm();
        this.formName = this.form.title;
        this.isThisRegisterForm = this.form.isRegisterFormPriority !== '';
        this.pages = this.form.pages;
        this.pageIndex = 0 ; 
        for (let i = 0; i < this.pages.length; i++) {
            this.pagesIndex.push(i + 1);
        }
        this.dragulaService.drop('elemnts').subscribe(({ name, el, target, source, sibling }) => {
            // ...
            console.log('dragula drop event');
            console.log(el.id);
            console.log(el.parentElement.className);
            console.log('siblings');
            console.log(sibling);
            this.orderChanged(el,
                el.parentElement.className === 'left-col col' ? 'LEFT' : 'RIGHT',
                sibling);
        });

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
            this.createElement(
                this.form.pages[0].formComposition[i].type,
                (this.form.pages[0].formComposition[i].container === 'LEFT' ? 1 : 2),
                this.form.pages[0].formComposition[i].labelTitle,
                i,
                options
            );
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
        this.pageSaved = false;
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
            this.formComposition.push(new Element(this.elementCounter, type, type, (container === 1 ? 'LEFT' : 'RIGHT')));
            this.createElement(type, container, undefined, this.elementCounter, []);
            this.elementCounter++;
        }
    }

    orderChanged(elementId, targetContainer, sibling) {
        console.log('sibling');
        console.log(sibling);
        const droppedId = parseInt(elementId.id.replace(/el-/g, ''), 10);
        let nextElementId;
        if (sibling !== null) {
            nextElementId = parseInt(sibling.id.replace(/el-/g, ''), 10);
        } else {
            nextElementId = (this.elementCounter - 1);
        }
        console.log('droped element ' + droppedId);
        console.log('nex element ' + nextElementId);
        const aux = this.formComposition[droppedId];
        this.formComposition[droppedId] = this.formComposition[nextElementId];
        this.formComposition[droppedId].container = targetContainer;
        this.formComposition[nextElementId] = aux;

        console.log('new form composiiton');
        console.log(this.formComposition);
    }

    allowDrag(event) {
        event.preventDefault();
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
                    '<input type="password" id="" name="percent" />';
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

        div += '<span style="display: none;">' +
            '<a title="Mover a la derecha" id="move-' + this.elementCounter + '">' +
            '<svg aria-hidden="true" data-prefix="fas" data-icon="arrow-alt-circle-right" ' +
            'class="svg-inline--fa fa-arrow-alt-circle-right fa-w-16 " role="img" ' +
            'xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">' +
            path +
            '</svg>' +
            '</a>' +
            '<a title="Borrar" id="delete-' + this.elementCounter + '">' +
            '<svg aria-hidden="true" data-prefix="fas" data-icon="trash-alt" class="svg-inline--fa fa-trash-alt fa-w-14 " ' +
            'role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">' +
            '<path fill="currentColor" ' +
            // tslint:disable-next-line:max-line-length
            'd="M0 84V56c0-13.3 10.7-24 24-24h112l9.4-18.7c4-8.2 12.3-13.3 21.4-13.3h114.3c9.1 0 17.4 5.1 21.5 13.3L312 32h112c13.3 0 24 10.7 24 24v28c0 6.6-5.4 12-12 12H12C5.4 96 0 90.6 0 84zm416 56v324c0 26.5-21.5 48-48 48H80c-26.5 0-48-21.5-48-48V140c0-6.6 5.4-12 12-12h360c6.6 0 12 5.4 12 12zm-272 68c0-8.8-7.2-16-16-16s-16 7.2-16 16v224c0 8.8 7.2 16 16 16s16-7.2 16-16V208zm96 0c0-8.8-7.2-16-16-16s-16 7.2-16 16v224c0 8.8 7.2 16 16 16s16-7.2 16-16V208zm96 0c0-8.8-7.2-16-16-16s-16 7.2-16 16v224c0 8.8 7.2 16 16 16s16-7.2 16-16V208z">' +
            '</path></svg></a></span>';
        div += '</div>';
        if (container === 1) {
            this.left_container.nativeElement.insertAdjacentHTML('beforeEnd', div);
        } else {
            this.right_container.nativeElement.insertAdjacentHTML('beforeEnd', div);

        }

        for (let i = 0; i < this.elementCounter + 1; i++) {
            if (this.elementRef.nativeElement.querySelector('#el-' + i) !== undefined
                && this.elementRef.nativeElement.querySelector('#el-' + i) !== null) {
                this.elementRef.nativeElement.querySelector('#el-' + i).addEventListener('click', (event) => this.selectElement(event));
                this.elementRef.nativeElement.querySelector('#el-' + i).addEventListener('dragstart',
                    (event) => this.drag(event, type, i));
                this.elementRef.nativeElement.querySelector('#delete-' + i).addEventListener('click',
                    (event) => this.removeElement(event, container, i));
                this.elementRef.nativeElement.querySelector('#move-' + i).addEventListener('click',
                    (event) => this.moveElement(event, (container === 1 ? 2 : 1), type, i));
            }

        }

        // for (let i = 0; i < this.elementCounter + 1; i++) {
        //     if (this.elementRef.nativeElement.querySelector('#el-' + i) !== undefined
        //         && this.elementRef.nativeElement.querySelector('#el-' + i) !== null) {
        //         this.elementRef.nativeElement.querySelector('#el-' + i).addEventListener('click', (event) => this.selectElement(event));
        //         this.elementRef.nativeElement.querySelector('#delete-' + i).addEventListener('click',
        //             (event) => this.removeElement(event, container, i));
        //         this.elementRef.nativeElement.querySelector('#move-' + i).addEventListener('click',
        //             (event) => this.moveElement(event, (container === 1 ? 2 : 1), type, i));
        //     }

        // }
    }

    selectElementAction(event){
        this.shoudlShowValueOptions = false;
        if (this.labelTitleInput !== undefined) {
            this.labelTitleInput.nativeElement.value = '';
            this.roleSelector.nativeElement.selectedIndex = 0;

        }
        const target = event.target.parentNode;
        if (event.target.tagName === 'DIV' || event.target.tagName === 'INPUT' || event.target.tagName === 'LABEL') {
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
            this.renderer.setStyle(target.children[2], 'display', 'block');
            this.elementSelected = true;

            // tslint:disable-next-line:radix
            this.selectedElementIndex = parseInt(target.id.replace(/el-/g, ''));
            console.log('selected element ' + this.selectedElementIndex);
            this.componentSelected = this.formComposition[this.selectedElementIndex];
            this.conditionCheckedBoxIsChecked = this.formComposition[this.selectedElementIndex].isConditioned;
            this.requiredCheckedBoxIsChecked = this.formComposition[this.selectedElementIndex].isRequired;
            this.elementLabelTitle =this.formComposition[this.selectedElementIndex].labelTitle;
            if(this.labelTitleInput !== undefined){
                this.labelTitleInput.nativeElement.value = this.formComposition[this.selectedElementIndex].labelTitle;
            }

            if (this.formComposition[this.selectedElementIndex].type === 'radio'
                || this.formComposition[this.selectedElementIndex].type === 'checkbox'
                || this.formComposition[this.selectedElementIndex].type === 'multi_select'
                || this.formComposition[this.selectedElementIndex].type === 'dropdown') {
                this.shoudlShowValueOptions = true;
                if (this.formComposition[this.selectedElementIndex].options !== ''
                    && this.formComposition[this.selectedElementIndex].options !== undefined) {
                    const opts = JSON.parse(this.formComposition[this.selectedElementIndex].options);
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
            this.formComposition[this.selectedElementIndex].role =
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

            if (this.formComposition[this.selectedElementIndex].type === 'radio'
            ) {
                id = '#rd-' + this.selectedElementIndex;

            }
            if (this.formComposition[this.selectedElementIndex].type === 'checkbox') {
                id = '#cb-' + this.selectedElementIndex;

            }
            if (this.formComposition[this.selectedElementIndex].type === 'multi_select'
                || this.formComposition[this.selectedElementIndex].type === 'dropdown') {
                id = '#sel-' + this.selectedElementIndex;
            }
            console.log('the id ' + id);
            div = this.elementRef.nativeElement.querySelector(id);
            div.innerHTML = '';

            if (this.formComposition[this.selectedElementIndex].type === 'multi_select'
                || this.formComposition[this.selectedElementIndex].type === 'dropdown') {
                div.innerHTML = '<option value="">--por favor, elija--</option></select>';
            }
            this.formComposition[this.selectedElementIndex].options = JSON.stringify(values);
            for (let i = 0; i < values.length; i++) {
                if (values[i] !== '') {
                    if (this.formComposition[this.selectedElementIndex].type === 'radio'
                    ) {
                        const op = '<p><input type="radio" name="checkbox-' + this.selectedElementIndex + '" id="checkbox2" ' +
                            'value="checkbox 1"><label for="radio1">' + values[i] + '</label></p>';
                        div.innerHTML += op;
                    }
                    if (this.formComposition[this.selectedElementIndex].type === 'checkbox') {
                        const op = '<p><input type="checkbox" name="checkbox-' + this.selectedElementIndex + '" id="checkbox2" ' +
                            'value="checkbox 1"><label for="radio1">' + values[i] + '</label></p>';
                        div.innerHTML += op;
                    }
                    if (this.formComposition[this.selectedElementIndex].type === 'multi_select'
                        || this.formComposition[this.selectedElementIndex].type === 'dropdown') {
                        const op = '<option value="' + values[i] + '">' + values[i] + '</option></select>';
                        div.innerHTML += op;

                    }
                }


            }
        }
    }

    disselectAllElemnt() {
        this.shouldShowButtonActionSection = false;
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
            this.renderer.setStyle(children[i], 'opacity', '1');
            this.renderer.setStyle(children[i], 'background', 'none');
            this.renderer.setStyle(children[i].children[2], 'display', 'none');
        }

        children = this.right_container.nativeElement.children;
        for (let i = 0; i < children.length; i++) {
            this.renderer.setStyle(children[i], 'opacity', '1');
            this.renderer.setStyle(children[i], 'background', 'none');
            this.renderer.setStyle(children[i].children[2], 'display', 'none');
        }
    }

    removeElement(event, fromContainer, id) {
        console.log('delete element');
        this.disselectAllElemnt(); 
        this.formComposition.splice(id , 1);
        this.deleteElement(id, fromContainer);
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
        console.log('move element');
        this.createElement(type, toContainer, '', id, []);
        this.deleteElement(id, (toContainer === 1 ? 2 : 1));
    }
    addPage() {
        console.log('add page');
        this.pageCounter++;
        const page = new Page(this.formComposition, 
            this.pageTitleTemp === undefined ? 'step ' + this.pageCounter : this.pageTitleTemp ,
            this.elementCounter
            );
            this.pageTitleTemp = undefined  ;         page.conditions = this.conditions;
        this.pages.push(page);

        this.elementCounter = 0;
        this.formComposition = [];
        // this.conditions = [];
        this.left_container.nativeElement.innerHTML = '';
        this.right_container.nativeElement.innerHTML = '';
        console.log(this.pages);
        this.pagesIndex.push(this.pageIndex + 1);
        this.pageSaved = true;
    }
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
        lbl.innerHTML = this.labelTitleInput.nativeElement.value;
        this.formComposition[this.selectedElementIndex].labelTitle = this.labelTitleInput.nativeElement.value;
    }

    loadPage(page: Page, index: number) {

        console.log('loading form ' + index);
        console.log(page);
        this.left_container.nativeElement.innerHTML = '';
        this.right_container.nativeElement.innerHTML = '';
        this.formTitleContainer.nativeElement.innerHTML = page.pageTitle;
        this.formComposition = page.formComposition;
        this.elementSelected = false;
        this.conditions = page.conditions;
        this.pageIndex = index;

        for (let i = 0; i < this.formComposition.length; i++) {
            console.log('element');
            console.log(this.formComposition[i].container);
            let options = [];
            if (this.formComposition[i].options !== undefined) {
                options = JSON.parse(this.formComposition[i].options);
            }
            this.createElement(
                this.formComposition[i].type,
                (this.formComposition[i].container === 'LEFT' ? 1 : 2),
                this.formComposition[i].labelTitle,
                i,
                options
            );
            this.elementCounter = i;
        }



    }

    selectEqualField(index, shouldLoadValue?) {
        console.log('select radio condition');
        this.fieldConditionChanged = true;
        console.log('fieldConditionChanged ' + this.fieldConditionChanged) ; 
        
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
        this.fieldConditionChanged = true;
        console.log('fieldConditionChanged ' + this.fieldConditionChanged) ; 
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
            const ecp1 = this.equalDropField11.nativeElement.options[this.equalDropField11.nativeElement.selectedIndex].value;
            if (ecp1 !== -1) {
                console.log('ecp is not -1');
                console.log(ecp1);
                let index = -1;
                for (let i = 0; i < this.formComposition.length; i++) {
                    console.log('element id ' + this.formComposition[i].id);
                    if (this.formComposition[i].id.toString() === ecp1.toString()) {
                        index = i;
                        break;
                    }
                }
                if (index !== -1) {
                    console.log('cp is not defined');
                    if (this.formComposition[index].options !== undefined && this.formComposition[index].options !== '') {
                        console.log('cp option is good');
                        this.selectTypeValues = JSON.parse(this.formComposition[index].options);
                    }
                }
            } else {
                this.selectTypeValues = [];
            }
            console.log('options &&&&&&&&');
            console.log(this.selectTypeValues);

        } else {
            const ecp1 = this.notEqualDropField11.nativeElement.options[this.notEqualDropField11.nativeElement.selectedIndex].value;
            if (ecp1 !== -1) {
                let index = -1;
                for (let i = 0; i < this.formComposition.length; i++) {
                    console.log('element id ' + this.formComposition[i].id);
                    if (this.formComposition[i].id.toString() === ecp1.toString()) {
                        index = i;
                        break;
                    }
                }
                if (index !== -1) {
                    console.log('cp is not defined');
                    if (this.formComposition[index].options !== undefined && this.formComposition[index].options !== '') {
                        console.log('cp option is good');
                        this.selectTypeValuesNotEqual = JSON.parse(this.formComposition[index].options);
                    }
                }
            } else {
                this.selectTypeValuesNotEqual = [];
            }
            console.log('options &&&&&&&');
            console.log(this.selectTypeValuesNotEqual);
        }
    }


    createCondition(index) {
        this.fieldConditionChanged  = true ; 
        console.log('fieldConditionChanged '+this.fieldConditionChanged);
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
        this.fieldConditionChanged = false ;
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

    }

    makeFieldRequired() {
        if (this.isFieldRequired.nativeElement.checked) {
            this.formComposition[this.selectedElementIndex].isRequired = true;
        } else {
            this.formComposition[this.selectedElementIndex].isRequired = false;
        }
    }

    makeFieldCondition() {
        console.log('make field contioned');
        console.log(this.formComposition[this.selectedElementIndex].type);
        if (this.isFieldConditioned.nativeElement.checked) {
            this.formComposition[this.selectedElementIndex].isConditioned = true;
            if (this.formComposition[this.selectedElementIndex].type === 'radio'
                || this.formComposition[this.selectedElementIndex].type === 'dropdown') {
                console.log('field radio or dropdown');
                this.selectTypeElements.push(this.formComposition[this.selectedElementIndex]);
            } else if (this.formComposition[this.selectedElementIndex].type === 'checkbox') {
                const options = JSON.parse(this.formComposition[this.selectedElementIndex].options);
                if (options !== undefined) {
                    if (options.length === 1) {
                        console.log('field checkbox');
                        this.oneOptionTypeElemnts.push(this.formComposition[this.selectedElementIndex]);
                    }
                }

            } else {
                if (this.formComposition[this.selectedElementIndex].type !== 'password'
                    && this.formComposition[this.selectedElementIndex].type !== 'multi_select'
                ) {
                    console.log('field text');
                    this.textTypeElements.push(this.formComposition[this.selectedElementIndex]);
                }
            }


            this.conditionedFormCompotion.push(this.formComposition[this.selectedElementIndex]);
        } else {
            this.formComposition[this.selectedElementIndex].isConditioned = false;


            if (this.formComposition[this.selectedElementIndex].type === 'radio'
                || this.formComposition[this.selectedElementIndex].type === 'dropdown') {
                let popIndex = -1;
                for (let i = 0; i < this.selectTypeElements.length; i++) {
                    if (this.selectTypeElements[i].id === this.formComposition[this.selectedElementIndex].id) {
                        popIndex = i;
                    }
                }
                if (popIndex !== -1) {
                    this.selectTypeElements.splice(popIndex, 1);
                }
            } else if (this.formComposition[this.selectedElementIndex].type === 'checkbox') {
                const options = JSON.parse(this.formComposition[this.selectedElementIndex].options);
                if (options !== undefined) {
                    if (options.length === 1) {
                        let popIndex = -1;
                        for (let i = 0; i < this.oneOptionTypeElemnts.length; i++) {
                            if (this.oneOptionTypeElemnts[i].id === this.formComposition[this.selectedElementIndex].id) {
                                popIndex = i;
                            }
                        }
                        if (popIndex !== -1) {
                            this.oneOptionTypeElemnts.splice(popIndex, 1);
                        }
                    }
                }

            } else {
                if (this.formComposition[this.selectedElementIndex].type !== 'password'
                    && this.formComposition[this.selectedElementIndex].type === 'multi_select'
                ) {
                    let popIndex = -1;
                    for (let i = 0; i < this.textTypeElements.length; i++) {
                        if (this.textTypeElements[i].id === this.formComposition[this.selectedElementIndex].id) {
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
    openDialog(f: Form): void {
        /*const dialogRef = this.dialog.open(PreviewformComponent, {
            width: '300px',
            data: { form: f }
        });

        dialogRef.afterClosed().subscribe(result => {
        });*/
    }

    previewForm(){
        if (this.pages.length === 0) {
            this.addPage();
        }
        const form = new Form(this.authService.getUserSession().userID,
            this.pages,
            (new Date()).toString(),
            this.formName);
            this.formService.setSelectedForm(form);
            this.router.navigate(['preview']);
        //this.openDialog(form);
    }



    saveForm() {
        console.log('form composition ' + this.pageIndex);
        if (this.pages.length === 0) {
            this.addPage();
        } else if (!this.pageSaved) {
            this.pages[this.pageIndex].formComposition = this.formComposition;
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
                form.isRegisterFormPriority = (new Date()).toString();
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

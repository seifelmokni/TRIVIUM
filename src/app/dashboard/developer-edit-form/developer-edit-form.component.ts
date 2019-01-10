import { Component, OnInit, ViewChild, ElementRef, Renderer2 } from '@angular/core';
import { FormsService } from '../../shared/forms/forms.service';
import { Element } from '../../models/element/element.model';
import { Form } from '../../models/form/form.model';
import { Page } from '../../models/page/page.model';
import { Model } from '../../models/model/model.model';
import { ModelsService } from '../../shared/models/models.service';
import { Router } from '@angular/router';
import { AuthService } from '../../shared/auth/auth.service';

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

    shoudlShowValueOptions = false;

    conditionRAdioGroup;
    actionRadioGroup;
    elementCounter = 0;
    pageCounter = 0;
    propertyTabShown: Boolean = false;
    editFormTitleEnabled: Boolean = false;
    elementSelected: Boolean = false;

    showActionSection: Boolean = false;
    selectedElementIndex: number;
    formComposition: Array<Element>;
    pages: Array<Page>;

    form: Form;
    pageIndex = 0;

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
        private router: Router) { }

    ngOnInit() {
        this.formComposition = [];
        this.pages = [];
        this.conditions = [];
        this.form = this.formService.getSelectedForm();

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
            this.createElement(
                this.form.pages[0].formComposition[i].type,
                (this.form.pages[0].formComposition[i].container === 'LEFT' ? 1 : 2),
                this.form.pages[0].formComposition[i].labelTitle,
                i,
                options
            );
        }


    }

    drag(event, type) {
        console.log('type ' + type);
        event.dataTransfer.setData('elementType', type);
        console.log('drag event');
        console.log(event);
        console.log('class name');
        console.log(event.target.className);
    }

    drop(event, container) {
        event.preventDefault();

        console.log('drop action ');
        console.log(event);
        console.log('drag class name');
        console.log(event.target.tagName);
        const type = event.dataTransfer.getData('elementType');
        if (type === '') {
            console.log('drop from inter');
        } else {
            this.formComposition.push(new Element(this.elementCounter, type, type, (container === 1 ? 'LEFT' : 'RIGHT')));
            this.createElement(type, container, undefined, this.elementCounter, []);
            this.elementCounter++;


        }




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
                    '<input type="text" id="fc' + this.elementCounter + '"  name="singleLine" />';

                break;
            }
            case 'phone': {
                div += '<label >' + (labelTitle === undefined ? 'phone' : labelTitle) + '</label>' +
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
                    '<div>';
                for (let i = 0; i < values.length; i++) {
                    div += '<p>' +
                        '<input type="radio" name="checkbox" id="fc' + this.elementCounter + '-1" ' +
                        ' value="checkbox 1"><label for="radio1">' + values[i] + '</label>' +
                        '</p>';
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
                    '<div>';
                for (let i = 0; i < values.length; i++) {
                    div += '<p>' +
                        '<input type="checkbox" name="checkbox" id="fc' + this.elementCounter + '-1" ' +
                        ' value="checkbox 1"><label for="radio1">' + values[i] + '</label>' +
                        '</p>';
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
                    '<select id="fc' + this.elementCounter + '" name="dropdown"><option value="">--por favor, elija--</option></select>';

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

    selectElement(event) {
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

            if (this.formComposition[this.selectedElementIndex].type === 'radio'
                || this.formComposition[this.selectedElementIndex].type === 'checkbox'
                || this.formComposition[this.selectedElementIndex].type === 'multi_select'
                || this.formComposition[this.selectedElementIndex].type === 'dropdown') {
                this.shoudlShowValueOptions = true;

            }
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
        if (code === 13 || code === 8) {
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
        this.renderer.removeChild(container.nativeElement, element);
    }

    moveElement(event, toContainer, type, id) {
        console.log('move element');
        this.createElement(type, toContainer, undefined, this.elementCounter, []);
        this.deleteElement(id, (toContainer === 1 ? 2 : 1));
    }
    addPage() {
        console.log('add page');
        this.pageCounter++;
        const page = new Page(this.formComposition, this.formTitleContainer.nativeElement.innerHTML, this.elementCounter);
        page.conditions = this.conditions;

        this.pages.push(page);

        this.elementCounter = 0;
        this.formComposition = [];
        // this.conditions = [];
        this.left_container.nativeElement.innerHTML = '';
        this.right_container.nativeElement.innerHTML = '';
        console.log(this.pages);
    }

    editFormName() {
        if (!this.editFormTitleEnabled) {
            this.editFormTitleEnabled = true;
            this.formNameInput.nativeElement.value = this.formTitleContainer.nativeElement.innerHTML;
        } else {
            this.editFormTitleEnabled = false;
            this.formTitleContainer.nativeElement.innerHTML = this.formNameInput.nativeElement.value;
        }
    }

    editLabelTitle() {
        const lbl = this.elementRef.nativeElement.querySelector('#lbl-' + this.selectedElementIndex);
        lbl.innerHTML = this.labelTitleInput.nativeElement.value;
        this.formComposition[this.selectedElementIndex].labelTitle = this.labelTitleInput.nativeElement.value;
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

        for (let i = 0; i < this.formComposition.length; i++) {
            console.log('element');
            console.log(this.formComposition[i].container);
            this.createElement(
                this.formComposition[i].type,
                (this.formComposition[i].container === 'LEFT' ? 1 : 2),
                this.formComposition[i].labelTitle, i, []);
            this.elementCounter = i;
        }



    }

    selectEqualField(index) {
        console.log('select radio condition');

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
            //     const ecp1 = this.equalDropField11.nativeElement.options[this.equalDropField11.nativeElement.selectedIndex].value;
            //     const ecp2 = this.equalDropField12.nativeElement.options[this.equalDropField12.nativeElement.selectedIndex].value;
            //     console.log('ecp');
            //     console.log(ecp1 + '  ' + ecp2);
            //     const condition = { conditionType: 'equal', compareTo: ecp1, compareType: 'element', compareValue: ecp2 };
            //     this.conditions.push(condition);
        }

        this.showActionSection = true;


    }

    selectNotEqualField(index) {
        console.log('select radio condition');

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
            //     const ecp1 = this.equalDropField11.nativeElement.options[this.equalDropField11.nativeElement.selectedIndex].value;
            //     const ecp2 = this.equalDropField12.nativeElement.options[this.equalDropField12.nativeElement.selectedIndex].value;
            //     console.log('ecp');
            //     console.log(ecp1 + '  ' + ecp2);
            //     const condition = { conditionType: 'equal', compareTo: ecp1, compareType: 'element', compareValue: ecp2 };
            //     this.conditions.push(condition);
        }

        this.showActionSection = true;


    }


    createCondition(index) {

        switch (index) {
            case 1: {
                // Mask Field
                const ao =
                    this.actionMaskSelector.nativeElement.options[this.actionMaskSelector.nativeElement.selectedIndex].value;
                const at = 'mask';
                const af = '';
                this.cond.actionOn = ao;
                this.cond.actionType = at;
                this.cond.actionFrom = af;
                break;
            }
            case 2: {
                // field not required
                const ao =
                    this.actionRequiredSelector.nativeElement.options[this.actionRequiredSelector.nativeElement.selectedIndex].value;
                const at = 'fieldRequired';
                const af = '';
                this.cond.actionOn = ao;
                this.cond.actionType = at;
                this.cond.actionFrom = af;
                break;
            }
            case 3: {
                // field not required
                const ao =
                    this.actionNotRequiredSelector.nativeElement.options[this.actionNotRequiredSelector.nativeElement.selectedIndex].value;
                const at = 'fieldNotRequired';
                const af = '';
                this.cond.actionOn = ao;
                this.cond.actionType = at;
                this.cond.actionFrom = af;
                break;
            }
            case 4: {
                // copy value from element to element
                const ao =
                    this.actionCopyValueToSelector.nativeElement.options[this.actionCopyValueToSelector.nativeElement.selectedIndex].value;
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
                const ao =
                    this.actionCopyTextToSelector.nativeElement.options[this.actionCopyTextToSelector.nativeElement.selectedIndex].value;
                const at = 'copyText';
                const af = this.actionCopyTextInput.nativeElement.value;
                this.cond.actionOn = ao;
                this.cond.actionType = at;
                this.cond.actionFrom = af;
                break;
            }
            case 6: {
                break;
            }
        }

    }

    validateCondition() {
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
        console.log(this.cond);
        this.conditions.push(this.cond);
    }

    makeFieldRequired() {
        if (this.isFieldRequired.nativeElement.checked) {
            this.formComposition[this.selectedElementIndex].isRequired = true;
        } else {
            this.formComposition[this.selectedElementIndex].isRequired = false;
        }
    }

    makeFieldCondition() {
        if (this.isFieldConditioned.nativeElement.checked) {
            this.formComposition[this.selectedElementIndex].isConditioned = true;
        } else {
            this.formComposition[this.selectedElementIndex].isConditioned = false;
        }
    }



    saveForm() {
        console.log('form composition ' + this.pageIndex);
        // if (this.pages.length === 0) {
        //     const page = new Page(this.formComposition, this.formTitleContainer.nativeElement.innerHTML, this.elementCounter);
        //     // page.conditions = this.conditions;
        //     this.pages.push(page);
        // } else {

        //     this.pages[this.pageIndex] =
        //         new Page(this.formComposition, this.formTitleContainer.nativeElement.innerHTML, this.elementCounter);
        //     // this.pages[this.pageIndex].conditions = this.conditions;
        // }



        if (this.modelSelector !== undefined) {
            if (this.modelSelector.nativeElement.selectedIndex !== 0) {
                this.form.modelToSendId =
                    this.modelSelector.nativeElement.options[this.modelSelector.nativeElement.selectedIndex].value;
            }
            if (this.isRegisterform.nativeElement.checked) {
                this.form.isRegisterFormPriority = (new Date()).toString();
            }
        }

        console.log(this.form);

        this.formService.update(this.form).then(
            () => {
                console.log('form update');
                this.router.navigate(['developper']);
            }
        );
    }

}

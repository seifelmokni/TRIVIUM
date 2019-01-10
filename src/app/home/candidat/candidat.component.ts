import { Component, OnInit, ViewChild, ElementRef, Renderer2 } from '@angular/core';
import { FormsService } from '../../shared/forms/forms.service';
import { Form } from '../../models/form/form.model';
import { Page } from '../../models/page/page.model';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { Response } from '../../models/response/response.model';
import { ResponseService } from '../../shared/response/response.service';
import { Router } from '@angular/router';
import { Candidate } from '../../models/candidate/candidate.model';
import { CandidateService } from '../../shared/candidate/candidate.service';
import { DocumentReference } from 'angularfire2/firestore';

@Component({
    selector: 'app-candidat',
    templateUrl: './candidat.component.html',
    styleUrls: ['./candidat.component.css']
})
export class CandidatComponent implements OnInit {

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
    constructor(
        private formService: FormsService,
        private formBuilder: FormBuilder,
        private renderer: Renderer2,
        private responseService: ResponseService,
        private router: Router,
        private candidateService: CandidateService
    ) { }

    ngOnInit() {
        this.candidate = new Candidate();
        this.condidateForm = this.formBuilder.group({});
        this.formService.listForms().subscribe(
            (forms: Form[]) => {
                if (forms !== undefined) {
                    this.forms = forms;
                    let priority: Date;
                    let selectedForm;
                    for (let i = 0; i < this.forms.length; i++) {
                        console.log('form');
                        console.log(this.forms[i]);
                        if (this.forms[i].isRegisterFormPriority !== undefined) {
                            if (priority < new Date(this.forms[i].isRegisterFormPriority) || priority === undefined) {
                                priority = new Date(this.forms[i].isRegisterFormPriority);
                                selectedForm = this.forms[i];
                            }

                        } else {
                            priority = new Date(this.forms[i].isRegisterFormPriority);
                            selectedForm = this.forms[i];
                        }
                    }


                    if (forms.length > 0) {
                        this.form = selectedForm;
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
                                    this.createElement(
                                        this.page.formComposition[i].type,
                                        (this.page.formComposition[i].container === 'LEFT' ? 1 : 2),
                                        this.page.formComposition[i].labelTitle,
                                        i,
                                        options
                                    );
                                }
                                this.candidateResponse = new Response();
                                this.candidateResponse.formId = this.form.formId;
                            }
                        }
                    }
                }
            }
        );
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
                    '<option value="">--por favor, elija--</option></select>';
                this.condidateForm.addControl('fc' + this.elementCounter, new FormControl(''));

                break;
            }
            case 'dropdown': {
                div += '<label for="" id="lbl-' + this.elementCounter + '" >' + (labelTitle === undefined ? 'Dropdown' : labelTitle) +
                    '</label>' +
                    '<select id="fc' + this.elementCounter + '" name="dropdown"><option value="">--por favor, elija--</option></select>';
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
                this.createElement(
                    this.page.formComposition[i].type,
                    (this.page.formComposition[i].container === 'LEFT' ? 1 : 2),
                    this.page.formComposition[i].labelTitle, i, options);
            }
        }
    }

    getPageResponse() {
        const pageResponse: Array<{ label: string, value: string, type: string, pageIndex: number, responseIndex: number }> = [];
        for (let i = 0; i < this.elementCounter + 1; i++) {
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
                        response.value = elt.options[elt.selectedIndex];
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

                }
                console.log('element ' + i);
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
            console.log('validate response');
            this.getPageResponse();
            console.log(this.candidateResponse);
            // this.responseService.saveResponse(this.candidateResponse).then(
            //     () => {
            //         console.log('response saved');
            //         this.router.navigate(['/candutureSubmitted']);
            //     }
            // );
            this.candidateService.saveCandidate(this.candidate).then(docRef => {
                console.log((docRef) ? (<DocumentReference>docRef).id : 'void'); // docRef of type void | DocumentReference
                this.candidateResponse.candidateId = docRef.id;
                this.responseService.saveResponse(this.candidateResponse).then(
                    () => {
                        console.log('response saved');
                        this.router.navigate(['/candutureSubmitted']);
                    }
                );
            });
        }
    }

    previous() {
        if (this.pageIndex > 0) {
            this.pageIndex--;
            this.loadPage(this.pageIndex);
        }

    }



}

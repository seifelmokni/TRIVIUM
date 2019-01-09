import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormsService } from '../../shared/forms/forms.service';
import { Form } from '../../models/form/form.model';
import { Page } from '../../models/page/page.model';

@Component({
    selector: 'app-formfilling',
    templateUrl: './formfilling.component.html',
    styleUrls: ['./formfilling.component.css']
})
export class FormfillingComponent implements OnInit {
    @ViewChild('left_container') left_container: ElementRef;
    @ViewChild('right_container') right_container: ElementRef;
    elementCounter = 0;
    form: Form;
    page: Page;
    pageIndex = 0;
    constructor(private formService: FormsService, private elementRef: ElementRef) { }

    ngOnInit() {
        this.form = this.formService.getSelectedForm();
        if (this.form !== undefined) {
            if (this.form.pages.length > 0) {
                this.page = this.form.pages[0];
                for (let i = 0; i < this.page.formComposition.length; i++) {
                    console.log('element');
                    console.log(this.page.formComposition[i].container);
                    this.createElement(
                        this.page.formComposition[i].type,
                        (this.page.formComposition[i].container === 'LEFT' ? 1 : 2),
                        this.page.formComposition[i].labelTitle);
                }
            }
        }


    }
    createElement(type: string, container, labelTitle?: string) {

        console.log('type is ' + type);
        let div = '<div class="two-col dynamic" style="opacity: 1; background: none;" draggable="true"' +
            ' id="el-' + this.elementCounter + '" >';
        switch (type) {
            case 'single_line': {
                div += '<label id="lbl-' + this.elementCounter + '" >' + (labelTitle === undefined ? 'Single Line' : labelTitle) +
                    '</label>' +
                    '<input type="text" id="" name="singleLine" />';
                break;
            }
            case 'phone': {
                div += '<label >' + (labelTitle === undefined ? 'phone' : labelTitle) + '</label>' +
                    '<input type="tel" id="" name="phone" />';
                break;
            }
            case 'multi_line': {
                div += '<label for="" id="lbl-' + this.elementCounter + '" >' + (labelTitle === undefined ? 'Multi line' : labelTitle) +
                    '</label>' +
                    '<textarea id="" name="multiLine" cols="25" rows="5" defaultvalue=""></textarea>';
                break;
            }
            case 'url': {
                div += '<label for="" id="lbl-' + this.elementCounter + '" >' + (labelTitle === undefined ? 'url' : labelTitle) +
                    '</label>' + '<input type="url" id="" name="url" />';
                break;
            }
            case 'date': {
                div += '<label for="" id="lbl-' + this.elementCounter + '" >' + (labelTitle === undefined ? 'date' : labelTitle) +
                    '</label>' + '<input type="date" id="" name="date" />';
                break;
            }
            case 'file_upload': {
                div += '<label for="" id="lbl-' + this.elementCounter + '" >' + (labelTitle === undefined ? 'File' : labelTitle) +
                    '</label>' + '<input type="file" id="" name="fileUpload" />';
                break;
            }
            case 'radio': {
                div += '<label for="" id="lbl-' + this.elementCounter + '" >' + (labelTitle === undefined ? 'Radio' : labelTitle) +
                    '</label>' +
                    '<div><p>' +
                    '<input type="radio" name="radio" id="radio1" value="Radio 1"><label for="radio1">Radio 1</label>' +
                    '</p>' +
                    '<p>' +
                    '<input type="radio" name="radio" id="radio2" value="Radio 2"><label for="radio2">Radio 2</label>' +
                    '</p>' +
                    '</div>';
                break;
            }
            case 'image': {
                div += '<label for="" id="lbl-' + this.elementCounter + '" >' + (labelTitle === undefined ? 'image' : labelTitle) +
                    '</label>' + '<input type="file" id="" name="image" />';
                break;
            }
            case 'checkbox': {
                div += '<label for="" id="lbl-' + this.elementCounter + '" >' + (labelTitle === undefined ? 'Checkbox' : labelTitle) +
                    '</label>' +
                    '<div><p>' +
                    '<input type="radio" name="checkbox" id="checkbox2" value="checkbox 1"><label for="radio1">checkbox 1</label>' +
                    '</p>' +
                    '<p>' +
                    '<input type="radio" name="checkbox" id="checkbox2" value="checkbox 2"><label for="radio2">checkbox 2</label>' +
                    '</p>' +
                    '</div>';
                break;
            }
            case 'text': {
                div += '<label for="" id="lbl-' + this.elementCounter + '" >' + (labelTitle === undefined ? 'text' : labelTitle) +
                    '</label>' + '<input type="text" id="" name="text" />';
                break;
            }
            case 'email': {
                div += '<label for="" id="lbl-' + this.elementCounter + '" >' + (labelTitle === undefined ? 'email' : labelTitle) +
                    '</label>' + '<input type="email" id="" name="email" />';
                break;
            }
            case 'number': {
                div += '<label for="" id="lbl-' + this.elementCounter + '" >' + (labelTitle === undefined ? 'number' : labelTitle) +
                    '</label>' + '<input type="number" id="" name="number" />';
                break;
            }
            case 'description': {
                div += '<label for="" id="lbl-' + this.elementCounter + '" >' + (labelTitle === undefined ? 'description' : labelTitle) +
                    '</label>' +
                    '<textarea id="" name="description" cols="25" rows="5" defaultvalue=""></textarea>';
                break;
            }
            case 'decimal': {
                div += '<label for="" id="lbl-' + this.elementCounter + '" >' + (labelTitle === undefined ? 'Decimal' : labelTitle) +
                    '</label>' + '<input type="text" id="" name="decimal" />';
                break;
            }
            case 'multi_select': {
                div += '<label for="" id="lbl-' + this.elementCounter + '" >' + (labelTitle === undefined ? 'Multi select' : labelTitle) +
                    '</label>' +
                    '<select multiple="" id="" name="multiSelect"><option value="">--por favor, elija--</option></select>';
                break;
            }
            case 'dropdown': {
                div += '<label for="" id="lbl-' + this.elementCounter + '" >' + (labelTitle === undefined ? 'Dropdown' : labelTitle) +
                    '</label>' +
                    '<select id="" name="dropdown"><option value="">--por favor, elija--</option></select>';
                break;
            }
            case 'note': {
                div += '<label for="" id="lbl-' + this.elementCounter + '" >' + (labelTitle === undefined ? 'Note' : labelTitle) +
                    '</label>' +
                    '<textarea id="" name="note" cols="25" rows="5" defaultvalue=""></textarea>';
                break;
            }
            case 'percent': {
                div += '<label for="" id="lbl-' + this.elementCounter + '" >' + (labelTitle === undefined ? 'Percent' : labelTitle) +
                    '</label>' +
                    '<input type="text" id="" name="percent" />';
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

    nextPage() {
        this.left_container.nativeElement.innerHTML = '';
        this.right_container.nativeElement.innerHTML = '';
        if (this.form !== undefined) {
            if (this.form.pages.length > this.pageIndex) {
                this.pageIndex++;
                this.page = this.form.pages[this.pageIndex];
                for (let i = 0; i < this.page.formComposition.length; i++) {
                    console.log('element');
                    console.log(this.page.formComposition[i].container);
                    this.createElement(
                        this.page.formComposition[i].type,
                        (this.page.formComposition[i].container === 'LEFT' ? 1 : 2),
                        this.page.formComposition[i].labelTitle);
                }
            } else {
                console.log('validating');
            }
        }


    }
}

import { Component, OnInit, ElementRef, Renderer2, Injectable, ViewChild } from '@angular/core';
import { FormsService } from '../../shared/forms/forms.service';
import { Form } from '../../models/form/form.model';


@Component({
    selector: 'app-developer-create-form',
    templateUrl: './developer-create-form.component.html',
    styleUrls: ['./developer-create-form.component.css']
})
export class DeveloperCreateFormComponent implements OnInit {
    @ViewChild('left_container') left_container: ElementRef;
    @ViewChild('right_container') right_container: ElementRef;
    @ViewChild('formTitleContainer') formTitleContainer: ElementRef;
    @ViewChild('formNameInput') formNameInput: ElementRef;
    elementCounter = 0;
    pageCounter = 0;
    propertyTabShown: Boolean = false;
    editFormTitleEnabled: Boolean = false;
    formComposition: Array<{ id: number, type: string }>;
    pages: Array<{ index: number, formComposition: Array<{ id: number, type: string }>, elementCount: number, title: string }>;


    constructor(private elementRef: ElementRef, private renderer: Renderer2, private formService: FormsService) { }

    ngOnInit() {
        this.formComposition = [];
        this.pages = [];
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
            this.formComposition.push({ id: this.elementCounter, type: type });
            this.createElement(type, container);

        }




    }

    allowDrag(event) {
        event.preventDefault();
    }



    createElement(type: string, container) {

        console.log('type is ' + type);
        let div = '<div class="two-col dynamic" style="opacity: 1; background: none;" draggable="true"' +
            ' id="el-' + this.elementCounter + '" >';
        switch (type) {
            case 'single_line': {
                div += '<label >Single Line</label>' + '<input type="text" id="" name="singleLine" />';
                break;
            }
            case 'phone': {
                div += '<label >phone</label>' + '<input type="tel" id="" name="phone" />';
                break;
            }
            case 'multi_line': {
                div += '<label for="">multi_line</label>' +
                    '<textarea id="" name="multiLine" cols="25" rows="5" defaultvalue=""></textarea>';
                break;
            }
            case 'url': {
                div += '<label for="">url</label>' + '<input type="url" id="" name="url" />';
                break;
            }
            case 'date': {
                div += '<label for="">date</label>' + '<input type="date" id="" name="date" />';
                break;
            }
            case 'file_upload': {
                div += '<label for="">date</label>' + '<input type="file" id="" name="fileUpload" />';
                break;
            }
            case 'radio': {
                div += '<label for="">radio</label>' +
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
                div += '<label for="">image</label>' + '<input type="file" id="" name="image" />';
                break;
            }
            case 'checkbox': {
                div += '<label for="">checkbox</label>' +
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
                div += '<label for="">text</label>' + '<input type="text" id="" name="text" />';
                break;
            }
            case 'email': {
                div += '<label for="">email</label>' + '<input type="email" id="" name="email" />';
                break;
            }
            case 'number': {
                div += '<label for="">number</label>' + '<input type="number" id="" name="number" />';
                break;
            }
            case 'description': {
                div += '<label for="">description</label>' +
                    '<textarea id="" name="description" cols="25" rows="5" defaultvalue=""></textarea>';
                break;
            }
            case 'decimal': {
                div += '<label for="">decimal</label>' + '<input type="text" id="" name="decimal" />';
                break;
            }
            case 'multi_select': {
                div += '<label for="">multi_select</label>' +
                    '<select multiple="" id="" name="multiSelect"><option value="">--por favor, elija--</option></select>';
                break;
            }
            case 'dropdown': {
                div += '<label for="">dropdown</label>' +
                    '<select id="" name="dropdown"><option value="">--por favor, elija--</option></select>';
                break;
            }
            case 'note': {
                div += '<label for="">note</label>' +
                    '<textarea id="" name="note" cols="25" rows="5" defaultvalue=""></textarea>';
                break;
            }
            case 'percent': {
                div += '<label for="">percent</label>' +
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
        this.elementCounter++;
        for (let i = 0; i < this.elementCounter; i++) {
            if (this.elementRef.nativeElement.querySelector('#el-' + i) !== undefined
                && this.elementRef.nativeElement.querySelector('#el-' + i) !== null) {
                this.elementRef.nativeElement.querySelector('#el-' + i).addEventListener('click', (event) => this.selectElement(event));
                this.elementRef.nativeElement.querySelector('#delete-' + i).addEventListener('click',
                    (event) => this.removeElement(event, container, i));
                this.elementRef.nativeElement.querySelector('#move-' + i).addEventListener('click',
                    (event) => this.moveElement(event, (container === 1 ? 2 : 1), type, i));
            }

        }
    }

    selectElement(event) {

        const target = event.target.parentNode;
        if (event.target.tagName === 'DIV' || event.target.tagName === 'INPUT' || event.target.tagName === 'LABEL') {
            console.log('element select');
            this.disselectAllElemnt();
            console.log(target);
            console.log(target.tagName);
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
        this.createElement(type, toContainer);
        this.deleteElement(id, (toContainer === 1 ? 2 : 1));
    }
    addPage() {
        console.log('add page');
        this.pageCounter++;
        const page = {
            index: this.pageCounter,
            formComposition: this.formComposition,
            title: this.formTitleContainer.nativeElement.innerHTML,
            elementCount: this.elementCounter
        };
        this.pages.push(page);

        this.elementCounter = 0;
        this.formComposition = [];
        this.left_container.nativeElement.innerHTML = '';
        this.right_container.nativeElement.innerHTML = '';
    }

    editFormName() {
        if (!this.editFormTitleEnabled) {
            this.editFormTitleEnabled = true;
            this.formNameInput.nativeElement.value = this.formTitleContainer.nativeElement.innerHTML;
        } else {
            this.editFormTitleEnabled = false ;
            this.formTitleContainer.nativeElement.innerHTML = this.formNameInput.nativeElement.value;
        }
    }

    loadPage(form) {
        console.log('loading form');
        console.log(form) ;
    }


    saveForm() {
        console.log('form composition');
        console.log(this.formComposition);
        const form = new Form('1', this.formComposition, 'test');
        this.formService.persist(form);
    }

}

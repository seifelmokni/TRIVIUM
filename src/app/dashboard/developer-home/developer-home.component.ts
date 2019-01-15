import { Component, OnInit, Renderer2, ElementRef } from '@angular/core';
import { Form } from '../../models/form/form.model';
import { FormsService } from '../../shared/forms/forms.service';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/map';
import { AuthService } from '../../shared/auth/auth.service';
import { DocumentReference } from 'angularfire2/firestore';
import { MatDialog } from '@angular/material';
import { DeleteAlertPopupComponent } from '../popup/delete-alert-popup/delete-alert-popup.component';

declare var $: any;

@Component({
    selector: 'app-developer-home',
    templateUrl: './developer-home.component.html',
    styleUrls: ['./developer-home.component.css']
})
export class DeveloperHomeComponent implements OnInit {
    formNameInputIndexSelected = -1;
    formName;

    forms: Form[];
    messagePart1 = '¿Estás seguro de que quieres borrar ';
    messagePart2 = ' ?';
    constructor(
        private formService: FormsService,
        private router: Router,
        private activatedRoute: ActivatedRoute,
        private renderer: Renderer2,
        private elementRef: ElementRef,
        private authService: AuthService,
        public dialog: MatDialog
    ) { }

    ngOnInit() {

        this.formService.listForms().subscribe(
            (f: Form[]) => {
                console.log('forms');
                console.log(f);
                this.forms = f;
                console.log('loading app.js');
                console.log('navigatioin ended');
                $.getScript('assets/js/app.js');
            }
        );
    }

    openDropDown(index) {

        for (let i = 0; i < this.forms.length; i++) {
            this.renderer.removeClass(this.elementRef.nativeElement.querySelector('#dpc-' + i), 'dropdown-open');
        }
        this.renderer.addClass(this.elementRef.nativeElement.querySelector('#dpc-' + index), 'dropdown-open');
    }

    previewForm(f: Form) {
        this.formService.setSelectedForm(f);
        this.router.navigate(['/preview']);
    }

    editForm(f: Form, event) {
        event.stopPropagation();
        this.formService.setSelectedForm(f);
        this.router.navigate(['/editForm']);
    }
    enableEditFormName(index) {
        this.formName = this.forms[index].title;
        this.formNameInputIndexSelected = index;

    }
    changeFormName(index) {
        this.forms[index].title = this.formName;
        this.formNameInputIndexSelected = -1;
        this.formService.update(this.forms[index]);

    }
    formNameInputChange(index, code) {
        if (code === 13) {
            this.changeFormName(index);
        }
    }
    duplicateForm(index) {
        const form = new Form(this.authService.getUserSession().userID,
            this.forms[index].pages,
            (new Date()).toString(),
            this.forms[index].title + ' copy');
        console.log('form duplicate');
        console.log(form);
        this.formService.persist(form).then(
            (docRef) => {
                console.log((docRef) ? (<DocumentReference>docRef).id : 'void'); // docRef of type void | DocumentReference
                // form.formId = (<DocumentReference>docRef).id;
                // this.forms.push(form);
            }
        );
    }
    deleteForm(index) {
        const message = this.messagePart1 + this.forms[index].title + this.messagePart2;
        const dialogRef = this.dialog.open(DeleteAlertPopupComponent, {
            width: '300px',
            height: '200px',
            data: { message: message }
        });

        dialogRef.afterClosed().subscribe(result => {
            console.log('The dialog was closed');
            console.log(result);
            if (result === true) {
                this.formService.delete(this.forms[index]);
            }


        });
    }

}

import { Component, OnInit, Renderer2, ElementRef } from '@angular/core';
import { Form } from '../../models/form/form.model';
import { FormsService } from '../../shared/forms/forms.service';
import { Router } from '@angular/router';

@Component({
    selector: 'app-developer-home',
    templateUrl: './developer-home.component.html',
    styleUrls: ['./developer-home.component.css']
})
export class DeveloperHomeComponent implements OnInit {


    forms: Form[];

    constructor(
        private formService: FormsService,
        private router: Router,
        private renderer: Renderer2,
        private elementRef: ElementRef
    ) { }

    ngOnInit() {

        this.formService.listForms().subscribe(
            (f: Form[]) => {
                console.log('forms');
                console.log(f);
                this.forms = f;
            }
        );
    }

    openDropDown(index) {

        for (let i = 0 ; i < this.forms.length ; i++) {
            this.renderer.removeClass(this.elementRef.nativeElement.querySelector('#dpc-' + i) , 'dropdown-open' ) ;
        }
        this.renderer.addClass(this.elementRef.nativeElement.querySelector('#dpc-' + index) , 'dropdown-open' ) ;
    }

    previewForm (f: Form) {
        this.formService.setSelectedForm(f);
        this.router.navigate(['/preview']);
    }

    editForm(f: Form, event) {
        event.stopPropagation();
        this.formService.setSelectedForm(f);
        this.router.navigate(['/editForm']);
    }

}

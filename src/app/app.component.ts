import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';


import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/map';

declare var $: any;

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
    title = 'TRIVIUM';

    constructor(private router: Router, private activatedRoute: ActivatedRoute) { }

    ngOnInit() {
        this.router.events
            .filter(event => event instanceof NavigationEnd)
            .map(() => this.activatedRoute)
            .subscribe((event) => {
                $.getScript('assets/js/app.js');
            });
    }
}

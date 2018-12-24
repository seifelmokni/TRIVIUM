import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {
    @Input() searchEnabled: Boolean = true ;
    @Input() reloadEnabled: Boolean = true ;
  constructor() { }

  ngOnInit() {
  }

}

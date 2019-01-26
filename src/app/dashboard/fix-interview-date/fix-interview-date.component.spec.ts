import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FixInterviewDateComponent } from './fix-interview-date.component';

describe('FixInterviewDateComponent', () => {
  let component: FixInterviewDateComponent;
  let fixture: ComponentFixture<FixInterviewDateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FixInterviewDateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FixInterviewDateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

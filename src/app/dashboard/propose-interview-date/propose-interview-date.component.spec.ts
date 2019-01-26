import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProposeInterviewDateComponent } from './propose-interview-date.component';

describe('ProposeInterviewDateComponent', () => {
  let component: ProposeInterviewDateComponent;
  let fixture: ComponentFixture<ProposeInterviewDateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProposeInterviewDateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProposeInterviewDateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

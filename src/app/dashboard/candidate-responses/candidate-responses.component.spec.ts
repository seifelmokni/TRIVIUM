import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CandidateResponsesComponent } from './candidate-responses.component';

describe('CandidateResponsesComponent', () => {
  let component: CandidateResponsesComponent;
  let fixture: ComponentFixture<CandidateResponsesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CandidateResponsesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CandidateResponsesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

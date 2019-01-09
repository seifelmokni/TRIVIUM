import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CandidateEntreviewComponent } from './candidate-entreview.component';

describe('CandidateEntreviewComponent', () => {
  let component: CandidateEntreviewComponent;
  let fixture: ComponentFixture<CandidateEntreviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CandidateEntreviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CandidateEntreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

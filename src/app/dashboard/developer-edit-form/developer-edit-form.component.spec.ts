import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeveloperEditFormComponent } from './developer-edit-form.component';

describe('DeveloperEditFormComponent', () => {
  let component: DeveloperEditFormComponent;
  let fixture: ComponentFixture<DeveloperEditFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeveloperEditFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeveloperEditFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

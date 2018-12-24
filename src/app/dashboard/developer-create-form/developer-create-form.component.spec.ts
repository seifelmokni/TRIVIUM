import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeveloperCreateFormComponent } from './developer-create-form.component';

describe('DeveloperCreateFormComponent', () => {
  let component: DeveloperCreateFormComponent;
  let fixture: ComponentFixture<DeveloperCreateFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeveloperCreateFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeveloperCreateFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

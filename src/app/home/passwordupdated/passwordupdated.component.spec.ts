import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PasswordupdatedComponent } from './passwordupdated.component';

describe('PasswordupdatedComponent', () => {
  let component: PasswordupdatedComponent;
  let fixture: ComponentFixture<PasswordupdatedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PasswordupdatedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PasswordupdatedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

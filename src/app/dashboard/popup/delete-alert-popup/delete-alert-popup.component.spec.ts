import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteAlertPopupComponent } from './delete-alert-popup.component';

describe('DeleteAlertPopupComponent', () => {
  let component: DeleteAlertPopupComponent;
  let fixture: ComponentFixture<DeleteAlertPopupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeleteAlertPopupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeleteAlertPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddCellPopupComponent } from './add-cell-popup.component';

describe('AddCellPopupComponent', () => {
  let component: AddCellPopupComponent;
  let fixture: ComponentFixture<AddCellPopupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddCellPopupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddCellPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

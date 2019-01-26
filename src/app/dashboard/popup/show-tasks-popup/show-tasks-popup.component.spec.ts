import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowTasksPopupComponent } from './show-tasks-popup.component';

describe('ShowTasksPopupComponent', () => {
  let component: ShowTasksPopupComponent;
  let fixture: ComponentFixture<ShowTasksPopupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShowTasksPopupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowTasksPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

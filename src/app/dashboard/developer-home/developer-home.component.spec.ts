import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeveloperHomeComponent } from './developer-home.component';

describe('DeveloperHomeComponent', () => {
  let component: DeveloperHomeComponent;
  let fixture: ComponentFixture<DeveloperHomeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeveloperHomeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeveloperHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

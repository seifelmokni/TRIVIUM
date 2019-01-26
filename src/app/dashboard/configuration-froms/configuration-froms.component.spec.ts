import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfigurationFromsComponent } from './configuration-froms.component';

describe('ConfigurationFromsComponent', () => {
  let component: ConfigurationFromsComponent;
  let fixture: ComponentFixture<ConfigurationFromsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConfigurationFromsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfigurationFromsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

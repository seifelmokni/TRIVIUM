import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfigurationSedeComponent } from './configuration-sede.component';

describe('ConfigurationSedeComponent', () => {
  let component: ConfigurationSedeComponent;
  let fixture: ComponentFixture<ConfigurationSedeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConfigurationSedeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfigurationSedeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

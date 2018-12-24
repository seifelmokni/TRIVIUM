import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SvgSpiritComponent } from './svg-spirit.component';

describe('SvgSpiritComponent', () => {
  let component: SvgSpiritComponent;
  let fixture: ComponentFixture<SvgSpiritComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SvgSpiritComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SvgSpiritComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

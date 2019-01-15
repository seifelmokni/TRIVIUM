import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PreviewformComponent } from './previewform.component';

describe('PreviewformComponent', () => {
  let component: PreviewformComponent;
  let fixture: ComponentFixture<PreviewformComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PreviewformComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PreviewformComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

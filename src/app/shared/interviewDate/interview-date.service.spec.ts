import { TestBed } from '@angular/core/testing';

import { InterviewDateService } from './interview-date.service';

describe('InterviewDateService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: InterviewDateService = TestBed.get(InterviewDateService);
    expect(service).toBeTruthy();
  });
});

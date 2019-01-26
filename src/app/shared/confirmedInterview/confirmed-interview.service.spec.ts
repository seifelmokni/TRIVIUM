import { TestBed } from '@angular/core/testing';

import { ConfirmedInterviewService } from './confirmed-interview.service';

describe('ConfirmedInterviewService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ConfirmedInterviewService = TestBed.get(ConfirmedInterviewService);
    expect(service).toBeTruthy();
  });
});

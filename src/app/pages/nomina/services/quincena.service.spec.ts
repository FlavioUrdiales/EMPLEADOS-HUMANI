import { TestBed } from '@angular/core/testing';

import { QuincenaService } from './quincena.service';

describe('QuincenaService', () => {
  let service: QuincenaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(QuincenaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

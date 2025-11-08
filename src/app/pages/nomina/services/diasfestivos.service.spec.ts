import { TestBed } from '@angular/core/testing';

import { DiasfestivosService } from './diasfestivos.service';

describe('DiasfestivosService', () => {
  let service: DiasfestivosService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DiasfestivosService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

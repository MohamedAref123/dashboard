import { TestBed } from '@angular/core/testing';

import { InsuransesService } from './insuranses.service';

describe('InsuransesService', () => {
  let service: InsuransesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(InsuransesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
